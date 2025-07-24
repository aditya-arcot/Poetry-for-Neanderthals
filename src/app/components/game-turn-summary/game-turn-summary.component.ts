import {
    Component,
    EventEmitter,
    inject,
    Input,
    OnInit,
    Output,
} from '@angular/core'
import { GamePointsEnum } from '@enums'
import { Card, gamePointsCategoryMap } from '@models'
import { AlertService } from '@services'
// eslint-disable-next-line no-restricted-imports
import { LoggerComponent } from '../logger.component'

@Component({
    selector: 'app-game-turn-summary',
    templateUrl: './game-turn-summary.component.html',
    styleUrl: './game-turn-summary.component.css',
})
export class GameTurnSummaryComponent
    extends LoggerComponent
    implements OnInit
{
    @Input({ required: true }) scores: number[] = []
    @Input({ required: true }) teamIdx = 0
    @Input({ required: true }) turnPoints: number[] = []
    @Input({ required: true }) turnCards: Card[] = []
    @Output() nextTurn = new EventEmitter<void>()

    private readonly alertSvc = inject(AlertService)

    readonly gamePointsEnum = GamePointsEnum
    editing = false
    buttonClasses = ['btn', 'btn-link']

    constructor() {
        super('GameTurnSummaryComponent')
    }

    ngOnInit(): void {
        if (this.turnPoints.length !== this.turnCards.length - 1)
            throw Error('turn points and cards mismatch')
    }

    editTurn = () => {
        this.editing = true
        this.alertSvc.addInfoAlert(
            this.logger,
            'Editing turn',
            'Select the 1-point word, 3-point phrase, or skip for each card',
            'The last card is used to end the turn and cannot be edited'
        )
    }

    saveTurn = () => {
        this.editing = false
        this.alertSvc.addSuccessAlert(this.logger, 'Saved turn')
    }

    editCardPoints = (gamePointsEnum: GamePointsEnum, cardIdx: number) => {
        this.turnPoints[cardIdx] = gamePointsEnum
    }

    continue = () => {
        if (this.editing) {
            this.alertSvc.addErrorAlert(
                this.logger,
                'Cannot continue while editing turn',
                'Please save your edits before continuing'
            )
            return
        }
        this.nextTurn.emit()
    }

    get totalTurnPoints(): number {
        return this.turnPoints.reduce((acc, points) => acc + points, 0)
    }

    getCardOnePointClass = (cardIdx: number): string => {
        return this.getCardCategoryClass(cardIdx, GamePointsEnum.One)
    }

    getCardThreePointClass = (cardIdx: number): string => {
        return this.getCardCategoryClass(cardIdx, GamePointsEnum.Three)
    }

    getCardSkipClass = (cardIdx: number): string => {
        return this.getCardCategoryClass(cardIdx, GamePointsEnum.Skip)
    }

    getTeamPoints = (teamIdx: number): number => {
        if (teamIdx === this.teamIdx) {
            return this.scores[teamIdx] + this.totalTurnPoints
        }
        return this.scores[teamIdx]
    }

    private getCardCategoryClass = (
        cardIdx: number,
        pointsEnum: GamePointsEnum
    ): string => {
        const classes = [...this.buttonClasses]
        if (this.editing) classes.push('editing')
        if (
            cardIdx < this.turnPoints.length &&
            this.turnPoints[cardIdx] === pointsEnum
        )
            classes.push(...this.getSelectedClasses(pointsEnum))
        else classes.push('text-body-tertiary')
        return classes.join(' ')
    }

    private getSelectedClasses = (pointsEnum: GamePointsEnum): string[] => {
        const category = gamePointsCategoryMap[pointsEnum]
        return [`text-${category}`, 'fw-bold']
    }
}
