import { provideHttpClient } from '@angular/common/http'
import {
    ApplicationConfig,
    importProvidersFrom,
    inject,
    provideAppInitializer,
    provideBrowserGlobalErrorListeners,
    provideZoneChangeDetection,
} from '@angular/core'
import { provideRouter } from '@angular/router'
import { StartupService } from '@services'
import { routes } from 'app/app.routes'
import { LoggerModule, NgxLoggerLevel } from 'ngx-logger'

const provideLogger = () => {
    return importProvidersFrom(
        LoggerModule.forRoot({
            level: NgxLoggerLevel.DEBUG,
        })
    )
}

export const appConfig: ApplicationConfig = {
    providers: [
        provideBrowserGlobalErrorListeners(),
        provideZoneChangeDetection({ eventCoalescing: true }),
        provideRouter(routes),
        provideHttpClient(),
        provideLogger(),
        provideAppInitializer(() => inject(StartupService).startup()),
    ],
}
