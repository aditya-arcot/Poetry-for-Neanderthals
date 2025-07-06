import { provideHttpClient } from '@angular/common/http'
import {
    ApplicationConfig,
    importProvidersFrom,
    inject,
    provideAppInitializer,
    provideBrowserGlobalErrorListeners,
    provideZoneChangeDetection,
} from '@angular/core'
import { provideRouter, Router } from '@angular/router'
import { RouteEnum } from '@enums'
import { StartupService } from '@services'
import { routes } from 'app/app.routes'
import { LoggerModule, NgxLoggerLevel } from 'ngx-logger'
import { lastValueFrom } from 'rxjs'

const provideLogger = () => {
    return importProvidersFrom(
        LoggerModule.forRoot({
            level: NgxLoggerLevel.DEBUG,
        })
    )
}

const provideInitializer = provideAppInitializer(async () => {
    const startupSvc = inject(StartupService)
    const router = inject(Router)
    await lastValueFrom(startupSvc.startup())
    if (!startupSvc.success) void router.navigateByUrl(RouteEnum.StartupError)
})

export const appConfig: ApplicationConfig = {
    providers: [
        provideBrowserGlobalErrorListeners(),
        provideZoneChangeDetection({ eventCoalescing: true }),
        provideRouter(routes),
        provideHttpClient(),
        provideLogger(),
        provideInitializer,
    ],
}
