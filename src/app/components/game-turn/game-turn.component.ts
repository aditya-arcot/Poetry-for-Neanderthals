import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core'
import { Card } from '@models'
import { GameService } from '@services'
// eslint-disable-next-line no-restricted-imports
import { LoggerComponent } from '../logger.component'

@Component({
    selector: 'app-game-turn',
    templateUrl: './game-turn.component.html',
})
export class GameTurnComponent extends LoggerComponent implements OnInit {
    @Output() turnDone = new EventEmitter<void>()

    private readonly gameSvc = inject(GameService)

    introScreen = true
    resumeScreen = false

    constructor() {
        super('GameTurnComponent')
    }

    ngOnInit(): void {
        this.introScreen = this.gameState.gameplay.turn.timeRemaining < 1
        if (!this.introScreen) {
            this.resumeScreen = true
        }
    }

    get gameState() {
        const state = this.gameSvc.gameState
        if (!state) throw Error('failed to get game state')
        return state
    }

    get timeRemaining(): number {
        return this.gameState.gameplay.turn.timeRemaining
    }

    get timeRemainingString(): string {
        const time = this.timeRemaining
        if (time == 1) return '1 second'
        return `${time} seconds`
    }

    get turnTime(): number {
        return this.gameState.settings.turnTime
    }

    get round(): number {
        return this.gameState.gameplay.round
    }

    get player(): number {
        return this.gameState.gameplay.player
    }

    get team(): number {
        return this.gameState.gameplay.team
    }

    get points(): number[] {
        return this.gameState.gameplay.turn.points
    }

    get cards(): Card[] {
        return this.gameState.gameplay.turn.cards
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

    resumeTurn = () => {
        this.resumeScreen = false
        this.startTurn(false)
    }

    startTurn = (newTurn = true): void => {
        this.introScreen = false

        if (newTurn) {
            this.gameSvc.updateGameState({
                gameplay: {
                    turn: {
                        timeRemaining: this.turnTime,
                        cards: [this.gameSvc.getNextCard()],
                    },
                },
            })
        }

        this.logger.debug('starting turn', {
            newTurn,
            points: this.points,
            cards: this.cards,
        })

        const interval = setInterval(() => {
            this.gameSvc.updateGameState({
                gameplay: {
                    turn: {
                        timeRemaining: this.timeRemaining - 1,
                    },
                },
            })
            if (this.timeRemaining < 1) {
                clearInterval(interval)
                this.logger.debug('ending turn', {
                    points: this.points,
                    cards: this.cards,
                })
                this.turnDone.emit()
            }
        }, 1000)
    }

    advance = (points: number): void => {
        this.gameSvc.updateGameState({
            gameplay: {
                turn: {
                    points: [...this.points, points],
                    cards: [...this.cards, this.gameSvc.getNextCard()],
                },
            },
        })
        this.logger.debug('advancing turn', {
            points: this.points,
            cards: this.cards,
        })
    }
}
