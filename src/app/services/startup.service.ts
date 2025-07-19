import { HttpErrorResponse } from '@angular/common/http'
import { inject, Injectable } from '@angular/core'
import { Router } from '@angular/router'
import { RouteEnum } from '@enums'
import {
    AlertService,
    CardService,
    createLoggerWithContext,
    LoggerService,
} from '@services'
import { catchError, Observable, of, switchMap } from 'rxjs'

@Injectable({
    providedIn: 'root',
})
export class StartupService {
    private readonly logger: LoggerService
    private readonly cardSvc = inject(CardService)
    private readonly alertSvc = inject(AlertService)
    private readonly router = inject(Router)

    success = false

    constructor() {
        this.logger = createLoggerWithContext('StartupService')
    }

    startup = (): Observable<void> => {
        this.logger.info('starting up')
        return this.cardSvc.loadCards().pipe(
            switchMap(() => {
                this.success = true
                return of(undefined)
            }),
            catchError((err: HttpErrorResponse) => {
                void this.router.navigateByUrl(RouteEnum.StartupError)
                this.alertSvc.addErrorAlert(this.logger, err.message)
                return of(undefined)
            })
        )
    }
}
