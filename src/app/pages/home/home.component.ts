import { Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core'
import {
    AbstractControl,
    FormBuilder,
    FormGroup,
    ReactiveFormsModule,
} from '@angular/forms'
import { Router } from '@angular/router'
import { LoggerComponent } from '@components'
import { RouteEnum } from '@enums'
import { GameService, RandomService } from '@services'

@Component({
    imports: [ReactiveFormsModule],
    templateUrl: './home.component.html',
})
export class HomeComponent extends LoggerComponent implements OnInit {
    private readonly formBuilder = inject(FormBuilder)
    private readonly gameSvc = inject(GameService)
    private readonly randomSvc = inject(RandomService)
    private readonly router = inject(Router)

    @ViewChild('newGameForm') newGameForm!: ElementRef<HTMLFormElement>
    newGameFormGroup: FormGroup

    newGame = false

    constructor() {
        super('HomeComponent')
        this.newGameFormGroup = this.formBuilder.group(
            {
                rounds: [3],
                playersPerTeam: [3],
                useCustomSeed: [false],
                customSeed: [null],
            },
            { validators: this.validateCustomSeed }
        )
    }

    ngOnInit(): void {
        // TODO check existing game state
        this.newGame = false
    }

    continueGame = () => {
        this.logger.info('continuing existing game')
        // TODO restore game state
    }

    startNewGame = () => {
        this.logger.info('starting new game')
        // TODO warn about overwriting existing game state
        this.newGame = true
    }

    handleNewGameFormKeypress = (event: KeyboardEvent) => {
        if (event.key === 'Enter') this.validateNewGameForm()
    }

    validateNewGameForm = () => {
        const newGameForm = this.newGameForm?.nativeElement
        if (!this.newGameFormGroup.valid) this.logger.debug('validation failed')
        else this.startGame()
        newGameForm.classList.add('was-validated')
    }

    validateCustomSeed = (control: AbstractControl) => {
        const useCustomSeed: boolean = control.get('useCustomSeed')?.value
        if (!useCustomSeed) return null

        const customSeed: number | null = control.get('customSeed')?.value
        if (customSeed === null) return { customSeedRequired: true }
        if (customSeed < 0 || customSeed > 999999)
            return { customSeedOutOfRange: true }
        return null
    }

    setCustomSeedValidity = (input: HTMLInputElement) => {
        if (this.newGameFormGroup.errors) {
            const messages = Object.keys(this.newGameFormGroup.errors)
            input.setCustomValidity(messages.join(', '))
        } else {
            input.setCustomValidity('')
        }
    }

    private startGame = () => {
        this.logger.debug('starting game', { ...this.newGameFormGroup.value })
        const seed =
            this.newGameFormGroup.value.customSeed ?? Date.now() % 1000000
        this.randomSvc.seed = String(seed)
        this.gameSvc.createState(
            this.newGameFormGroup.value.rounds,
            this.newGameFormGroup.value.playersPerTeam
        )
        void this.router.navigateByUrl(RouteEnum.Game)
    }
}
