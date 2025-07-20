import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core'
import { GamePointsEnum } from '@enums'
import { Card, gamePointsCategoryMap } from '@models'

@Component({
    selector: 'app-game-turn-summary',
    templateUrl: './game-turn-summary.component.html',
})
export class GameTurnSummaryComponent implements OnInit {
    @Input({ required: true }) points: number[] = []
    @Input({ required: true }) turnPoints: number[] = []
    @Input({ required: true }) turnCards: Card[] = []
    @Output() nextTurn = new EventEmitter<void>()

    ngOnInit(): void {
        if (this.turnPoints.length !== this.turnCards.length - 1)
            throw Error('turn points and cards mismatch')
    }

    getCardOnePointClass(cardIdx: number): string {
        return this.getCardCategoryClass(cardIdx, GamePointsEnum.One)
    }

    getCardThreePointClass(cardIdx: number): string {
        return this.getCardCategoryClass(cardIdx, GamePointsEnum.Three)
    }

    getCardSkipClass(cardIdx: number): string {
        return this.getCardCategoryClass(cardIdx, GamePointsEnum.Skip)
    }

    get totalTurnPoints(): number {
        return this.turnPoints.reduce((acc, points) => acc + points, 0)
    }

    private getCardCategoryClass = (
        cardIdx: number,
        pointsEnum: GamePointsEnum
    ): string => {
        if (cardIdx >= this.turnPoints.length) return 'text-body-tertiary'
        if (this.turnPoints[cardIdx] === pointsEnum)
            return this.createSelectedClass(pointsEnum)
        return 'text-body-tertiary'
    }

    private createSelectedClass = (pointsEnum: GamePointsEnum): string => {
        const category = gamePointsCategoryMap[pointsEnum]
        return `text-${category} fw-bold`
    }
}
