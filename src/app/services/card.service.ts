import { HttpClient } from '@angular/common/http'
import { inject, Injectable } from '@angular/core'
import { Card, RawCard } from '@models'
import {
    createLoggerWithContext,
    LoggerService,
    RandomService,
} from '@services'
import { catchError, forkJoin, map, Observable, of, switchMap } from 'rxjs'

@Injectable({
    providedIn: 'root',
})
export class CardService {
    private readonly logger: LoggerService
    private readonly http = inject(HttpClient)
    private readonly randomSvc = inject(RandomService)
    private readonly baseUrl = `/cards`

    private cards: Card[] = []

    constructor() {
        this.logger = createLoggerWithContext('CardService')
    }

    loadCards = (): Observable<void> => {
        this.logger.info('loading cards')
        return this.getCardFileNames().pipe(
            switchMap((fileNames) => this.getRawCardLists(fileNames)),
            map((rawCardLists) => this.processRawCardLists(rawCardLists)),
            catchError((err) => {
                this.logger.error('error loading cards', err)
                throw Error('failed to load cards')
            })
        )
    }

    private getCardFileNames = (): Observable<string[]> => {
        return this.http.get<string[]>(`${this.baseUrl}/index.json`).pipe(
            switchMap((fileNames: string[] | null) => {
                if (!fileNames || !fileNames.length) {
                    throw Error('no card filenames found in index')
                }
                this.logger.debug('found card filenames', { fileNames })
                return of(fileNames)
            })
        )
    }

    private getRawCardLists = (
        fileNames: string[]
    ): Observable<RawCard[][]> => {
        this.logger.debug(`loading ${fileNames.length} card files`)
        const requests = fileNames.map((name) =>
            this.http.get<RawCard[]>(`${this.baseUrl}/${name}.json`)
        )
        return forkJoin(requests)
    }

    private processRawCardLists = (rawCardLists: RawCard[][]) => {
        const cards = rawCardLists.flat().map(
            (entry): Card => ({
                id: `${entry['1']}-${entry['3']}`
                    .toLowerCase()
                    .replace(/\s+/g, '_'),
                onePoint: entry['1'],
                threePoint: entry['3'],
            })
        )
        if (!cards.length) throw Error('no cards found in card lists')

        cards.sort((a, b) => {
            const oneCompare = a.onePoint
                .toLowerCase()
                .localeCompare(b.onePoint.toLowerCase())
            return oneCompare !== 0
                ? oneCompare
                : a.threePoint
                      .toLowerCase()
                      .localeCompare(b.threePoint.toLowerCase())
        })

        this.logger.debug(`loaded ${cards.length} cards`, { cards })
        this.cards = cards
    }

    // should only be called by GameService
    _getNextCard = (usedCardIds: string[]): [Card, boolean] => {
        if (this.cards.length === 0) throw Error('no cards available')
        let availableCards = this.cards.filter(
            (card) => !usedCardIds.includes(card.id)
        )
        const resetAvailableCards = availableCards.length === 0
        if (resetAvailableCards) {
            this.logger.warn('no unused cards left, ignoring used cards')
            availableCards = this.cards
        }
        const idx = this.randomSvc.getRandomInt(0, availableCards.length - 1)
        return [availableCards[idx], resetAvailableCards]
    }
}
