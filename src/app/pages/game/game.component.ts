import { Component, inject, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import {
    GameSummaryComponent,
    GameTurnComponent,
    GameTurnSummaryComponent,
    LoggerComponent,
} from '@components'
import { GameComponentEnum, RouteEnum } from '@enums'
import { Card } from '@models'
import { GameService } from '@services'

@Component({
    imports: [
        GameTurnComponent,
        GameTurnSummaryComponent,
        GameSummaryComponent,
    ],
    templateUrl: './game.component.html',
})
export class GameComponent extends LoggerComponent implements OnInit {
    private readonly gameSvc = inject(GameService)
    private readonly router = inject(Router)

    readonly gameComponentEnum = GameComponentEnum

    gameComponent: GameComponentEnum = GameComponentEnum.Turn
    turnPoints: number[] = []
    turnCards: Card[] = []

    constructor() {
        super('GameComponent')
    }

    ngOnInit(): void {
        if (!this.gameSvc.getState()) {
            void this.router.navigateByUrl(RouteEnum.Home)
            return
        }
        this.gameState.gameStarted = true
    }

    get gameState() {
        const state = this.gameSvc.getState()
        if (!state) throw Error('failed to get game state')
        return state
    }

    get turnTime() {
        return this.gameState.turnTime
    }

    get round() {
        return this.gameState.currentRound + 1
    }

    get player() {
        return this.gameState.currentPlayerIdx + 1
    }

    get team() {
        return this.gameState.currentTeamIdx + 1
    }

    handleTurnDone = (event: { points: number[]; cards: Card[] }): void => {
        this.turnPoints = event.points
        this.turnCards = event.cards
        this.gameComponent = GameComponentEnum.Summary
    }

    handleNextTurn = (): void => {
        this.gameState.scores[this.gameState.currentTeamIdx] +=
            this.turnPoints.reduce((a, b) => a + b, 0)

        if (this.gameState.currentTeamIdx !== this.gameState.teams - 1) {
            this.gameState.currentTeamIdx++
        } else {
            if (
                this.gameState.currentPlayerIdx !==
                this.gameState.playersPerTeam - 1
            ) {
                this.gameState.currentPlayerIdx++
            } else {
                if (this.gameState.currentRound !== this.gameState.rounds - 1) {
                    this.gameState.currentPlayerIdx = 0
                    this.gameState.currentTeamIdx = 0
                    this.gameState.currentRound++
                } else {
                    this.gameState.gameOver = true
                    this.gameComponent = GameComponentEnum.End
                    return
                }
            }
        }
        this.gameComponent = GameComponentEnum.Turn
    }

    handleEndGame = (): void => {
        this.gameSvc.clearState()
        void this.router.navigateByUrl(RouteEnum.Home)
    }
}
