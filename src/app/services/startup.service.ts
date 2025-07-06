import { inject, Injectable } from '@angular/core'
import { CardService, createLoggerWithContext, LoggerService } from '@services'
import { catchError, Observable, of, switchMap } from 'rxjs'

@Injectable({
    providedIn: 'root',
})
export class StartupService {
    private cardSvc = inject(CardService)

    private readonly logger: LoggerService
    success = false

    constructor() {
        this.logger = createLoggerWithContext('StartupService')
    }

    startup(): Observable<void> {
        this.logger.info('starting up')
        return this.cardSvc.loadCards().pipe(
            switchMap((success) => {
                this.success = success
                return of(undefined)
            }),
            catchError((err) => {
                this.logger.error('startup error', { err })
                return of(undefined)
            })
        )
    }
}
