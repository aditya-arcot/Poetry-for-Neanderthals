import { GamePointsEnum } from '@enums'
import { Card } from '@models'
import seedrandom from 'seedrandom'

export const GAME_DATA_VERSION = 2

export interface GameData {
    state: GameState
    stateHash: string
    saveTimestamp: string
    version: number
}

export interface GameState {
    [key: string]: Settings | Gameplay
    settings: Settings
    gameplay: Gameplay
}

interface Settings {
    turnTime: number
    rounds: number
    teams: number
    playersPerTeam: number
    seed: string
}

interface Gameplay {
    usedCardIds: string[]
    round: number
    team: number
    player: number
    scores: number[]
    turn: Turn
    gameOver: boolean
    rngState: seedrandom.State.Arc4 | null
}

interface Turn {
    isDone: boolean
    isEditing: boolean
    timeRemaining: number
    points: number[]
    cards: Card[]
}

export const isInTurn = (gameState: GameState): boolean => {
    return (
        !gameState.gameplay.gameOver &&
        gameState.gameplay.turn.timeRemaining > 0 &&
        !gameState.gameplay.turn.isDone
    )
}

export const gamePointsCategoryMap: Record<GamePointsEnum, string> = {
    [GamePointsEnum.One]: 'primary',
    [GamePointsEnum.Three]: 'success',
    [GamePointsEnum.Skip]: 'danger',
}
