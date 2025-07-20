import { GamePointsEnum } from '@enums'

export interface GameState {
    rounds: number
    teams: number
    playersPerTeam: number

    currentRound: number
    currentPlayerIdx: number
    currentTeamIdx: number

    gameStarted: boolean
    gameOver: boolean
    scores: number[]
}

export const gamePointsCategoryMap: Record<GamePointsEnum, string> = {
    [GamePointsEnum.One]: 'primary',
    [GamePointsEnum.Three]: 'success',
    [GamePointsEnum.Skip]: 'danger',
}
