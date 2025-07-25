import { Component, inject, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import {
    GameSummaryComponent,
    GameTurnComponent,
    GameTurnSummaryComponent,
    LoggerComponent,
} from '@components'
import { RouteEnum } from '@enums'
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

    constructor() {
        super('GameComponent')
    }

    ngOnInit(): void {
        if (!this.gameSvc.gameState) {
            void this.router.navigateByUrl(RouteEnum.Home)
            return
        }
    }

    get gameState() {
        const state = this.gameSvc.gameState
        if (!state) throw Error('failed to get game state')
        return state
    }

    handleTurnDone = (): void => {
        this.gameSvc.updateGameState({
            gameplay: {
                turn: {
                    isDone: true,
                    isEditing: false,
                    timeRemaining: 0,
                },
            },
        })
    }

    handleNextTurn = (): void => {
        const scores = this.gameState.gameplay.scores
        const turnPoints = this.gameState.gameplay.turn.points
        scores[this.gameState.gameplay.team] += turnPoints.reduce(
            (a, b) => a + b,
            0
        )

        const teams = this.gameState.settings.teams
        const playersPerTeam = this.gameState.settings.playersPerTeam

        let round = this.gameState.gameplay.round
        let team = this.gameState.gameplay.team
        let player = this.gameState.gameplay.player
        let gameOver = this.gameState.gameplay.gameOver

        if (team !== teams - 1) {
            team++
        } else {
            if (player !== playersPerTeam - 1) {
                player++
                team = 0
            } else {
                if (round !== this.gameState.settings.rounds - 1) {
                    round++
                    player = 0
                    team = 0
                } else {
                    gameOver = true
                }
            }
        }

        this.gameSvc.updateGameState({
            gameplay: {
                round,
                team,
                player,
                scores,
                gameOver,
                turn: {
                    isDone: false,
                    isEditing: false,
                    points: [],
                    cards: [],
                },
            },
        })
    }

    handleEndGame = (): void => {
        this.gameSvc.clearGameState()
        void this.router.navigateByUrl(RouteEnum.Home)
    }
}
