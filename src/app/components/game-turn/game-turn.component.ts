import { Component, EventEmitter, inject, Input, Output } from '@angular/core'
import { Card } from '@models'
import { CardService } from '@services'
// eslint-disable-next-line no-restricted-imports
import { LoggerComponent } from '../logger.component'

@Component({
    selector: 'app-game-turn',
    templateUrl: './game-turn.component.html',
})
export class GameTurnComponent extends LoggerComponent {
    @Input({ required: true }) turnTime = 0
    @Input({ required: true }) round = 0
    @Input({ required: true }) player = 0
    @Input({ required: true }) team = 0
    @Output() turnDone = new EventEmitter<{
        points: number[]
        cards: Card[]
    }>()

    private readonly cardSvc = inject(CardService)

    intro = true
    time = this.turnTime
    cards: Card[] = []
    points: number[] = []

    constructor() {
        super('GameTurnComponent')
    }

    get card(): Card {
        if (this.cards.length === 0) throw Error('no cards available')
        return this.cards[this.cards.length - 1]
    }

    get onePointWord(): string {
        return this.card.onePoint
    }

    get threePointWord(): string {
        return this.card.threePoint
    }

    startTurn = (): void => {
        this.intro = false
        this.cards.push(this.cardSvc.getNextCard())
        this.logger.debug('starting turn', {
            points: this.points,
            cards: this.cards,
        })

        const interval = setInterval(() => {
            this.time--
            if (this.time <= 0) {
                clearInterval(interval)
                this.logger.debug('ending turn', { points: this.points })
                this.turnDone.emit({ points: this.points, cards: this.cards })
            }
        }, 1000)
    }

    advance = (points: number): void => {
        this.points.push(points)
        this.cards.push(this.cardSvc.getNextCard())
        this.logger.debug('advancing turn', {
            points: this.points,
            cards: this.cards,
        })
    }
}
