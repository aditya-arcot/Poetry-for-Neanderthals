import { GamePointsEnum } from '@enums'
import { Card } from '@models'
import seedrandom from 'seedrandom'

export const GAME_DATA_VERSION = 1

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

export const gamePointsCategoryMap: Record<GamePointsEnum, string> = {
    [GamePointsEnum.One]: 'primary',
    [GamePointsEnum.Three]: 'success',
    [GamePointsEnum.Skip]: 'danger',
}
