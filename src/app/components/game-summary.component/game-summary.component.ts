import { Component, EventEmitter, Input, Output } from '@angular/core'

@Component({
    selector: 'app-game-summary',
    templateUrl: './game-summary.component.html',
})
export class GameSummaryComponent {
    @Input({ required: true }) points: number[] = []
    @Output() endGame = new EventEmitter<void>()
}
