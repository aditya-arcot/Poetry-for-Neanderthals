import { Injectable } from '@angular/core'
import { GameState } from '@models'
import { LoggerService } from '@services'

@Injectable({
    providedIn: 'root',
})
export class GameService {
    private readonly logger: LoggerService

    private state: GameState | null = null

    constructor() {
        this.logger = new LoggerService('GameService')
    }

    createState = (
        rounds: number,
        turnTime: number,
        playersPerTeam: number
    ) => {
        const teams = 2
        this.state = {
            rounds,
            turnTime,
            teams,
            playersPerTeam,
            currentRound: 0,
            currentPlayerIdx: 0,
            currentTeamIdx: 0,
            gameStarted: false,
            gameOver: false,
            scores: [...Array(teams).fill(0)],
        }
        this.logger.info('created game', this.state)
    }

    getState = (): GameState | null => {
        if (!this.state) this.logger.warn('game state is not initialized')
        return this.state
    }

    clearState = (): void => {
        this.state = null
        this.logger.info('cleared game state')
    }
}
