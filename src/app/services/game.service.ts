import { inject, Injectable } from '@angular/core'
import {
    Card,
    DeepPartial,
    GAME_DATA_VERSION,
    GameData,
    GameState,
} from '@models'
import { CardService, LoggerService, RandomService } from '@services'
import { sortObject } from '@utilities'
// eslint-disable-next-line @typescript-eslint/naming-convention
import SHA256 from 'crypto-js/sha256'
import { cloneDeep, mergeWith } from 'lodash'

@Injectable({
    providedIn: 'root',
})
export class GameService {
    private readonly logger: LoggerService
    private readonly randomSvc = inject(RandomService)
    private readonly cardSvc = inject(CardService)

    private readonly storageKey = 'gameData'
    private _gameState: GameState | null = null

    constructor() {
        this.logger = new LoggerService('GameService')
        this.loadGameData()
    }

    get gameState(): Readonly<GameState> | null {
        const state = this._gameState
        if (!state) this.logger.warn('game state is not initialized')
        return state
    }

    createGameState = (
        turnTime: number,
        rounds: number,
        teams: number,
        playersPerTeam: number,
        seed: string
    ) => {
        const state: GameState = {
            settings: {
                turnTime,
                rounds,
                teams,
                playersPerTeam,
                seed,
            },
            gameplay: {
                usedCardIds: [],
                round: 0,
                team: 0,
                player: 0,
                scores: [...Array<number>(teams).fill(0)],
                turn: {
                    isDone: false,
                    isEditing: false,
                    timeRemaining: 0,
                    points: [],
                    cards: [],
                },
                gameOver: false,
                rngState: this.randomSvc.rngState,
            },
        }
        this._gameState = state
        this.saveGameData()
        this.logger.info('created game state', state)
    }

    updateGameState = (state: DeepPartial<GameState>) => {
        if (!this.gameState) throw Error('game state is not initialized')
        const newState: GameState = mergeWith(
            cloneDeep(this.gameState),
            state,
            (_, srcValue) => {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-return
                if (Array.isArray(srcValue)) return srcValue
                return
            }
        )
        this._gameState = newState
        this.saveGameData()
        this.logger.debug('updated game state', newState)
    }

    clearGameState = (): void => {
        this._gameState = null
        localStorage.removeItem(this.storageKey)
        this.logger.info('cleared game state')
    }

    getNextCard = (): Card => {
        if (!this.gameState) throw Error('game state is not initialized')
        const [card, resetAvailableCards] = this.cardSvc._getNextCard(
            this.gameState.gameplay.usedCardIds
        )
        const usedCardIds: string[] = [card.id]
        if (!resetAvailableCards) {
            usedCardIds.push(...this.gameState.gameplay.usedCardIds)
        }
        this.updateGameState({
            gameplay: {
                usedCardIds,
                rngState: this.randomSvc.rngState,
            },
        })
        return card
    }

    private saveGameData = (): void => {
        if (!this.gameState) {
            this.logger.warn('game state is not initialized')
            return
        }

        const sortedState = sortObject(this.gameState) as GameState
        const stateHash = SHA256(JSON.stringify(sortedState)).toString()
        const gameData: GameData = sortObject({
            state: this.gameState,
            stateHash,
            saveTimestamp: new Date().toISOString(),
            version: GAME_DATA_VERSION,
        }) as unknown as GameData
        localStorage.setItem(this.storageKey, JSON.stringify(gameData))

        this.logger.debug('saved game data', gameData)
    }

    private loadGameData = (): void => {
        const jsonString = localStorage.getItem(this.storageKey)
        if (!jsonString) {
            this.logger.warn('no saved game data found')
            return
        }

        try {
            const parsedGameData = JSON.parse(jsonString) as GameData

            const stateHash = SHA256(
                JSON.stringify(parsedGameData.state)
            ).toString()
            if (stateHash !== parsedGameData.stateHash) {
                this.logger.error('state hash mismatch', {
                    expected: parsedGameData.stateHash,
                    actual: stateHash,
                })
                return
            }

            if (parsedGameData.version !== GAME_DATA_VERSION) {
                this.logger.error('game data version mismatch', {
                    expected: GAME_DATA_VERSION,
                    actual: parsedGameData.version,
                })
                return
            }

            const rngState = parsedGameData.state.gameplay.rngState
            if (rngState) this.randomSvc.setRngFromState(rngState)

            this._gameState = parsedGameData.state
            this.logger.debug('loaded game data', parsedGameData.state)
        } catch (err) {
            this.logger.error('failed to parse game data', { error: err })
        }
    }
}
