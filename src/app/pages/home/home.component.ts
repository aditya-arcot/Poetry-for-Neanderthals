import { Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core'
import {
    AbstractControl,
    FormBuilder,
    FormGroup,
    ReactiveFormsModule,
} from '@angular/forms'
import { LoggerComponent } from '@components'

@Component({
    imports: [ReactiveFormsModule],
    templateUrl: './home.component.html',
})
export class HomeComponent extends LoggerComponent implements OnInit {
    private readonly formBuilder = inject(FormBuilder)

    @ViewChild('newGameForm') newGameForm!: ElementRef<HTMLFormElement>
    newGameFormGroup: FormGroup

    newGame = false

    constructor() {
        super('HomeComponent')
        this.newGameFormGroup = this.formBuilder.group(
            {
                playersPerTeam: [3],
                rounds: [5],
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
        // TODO warn user about overwriting existing game state
        this.newGame = true
    }

    handleNewGameFormKeypress = (event: KeyboardEvent) => {
        if (event.key === 'Enter') this.validateNewGameForm()
    }

    validateNewGameForm = () => {
        const newGameForm = this.newGameForm?.nativeElement
        if (!this.newGameFormGroup.valid) this.logger.info('validation failed')
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
        this.logger.info('starting game')

        const seed = this.newGameFormGroup.value.useCustomSeed
            ? this.newGameFormGroup.value.customSeed
            : Date.now() % 1000000
        this.logger.debug('parameters', {
            ...this.newGameFormGroup.value,
            seed,
        })

        // TODO create new game state
    }
}
