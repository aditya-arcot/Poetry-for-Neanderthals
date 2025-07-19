import { inject } from '@angular/core'
import { NGXLogger } from 'ngx-logger'

interface Log {
    message: string
    data?: unknown
    context?: string
}

export class LoggerService {
    private readonly logger = inject(NGXLogger)

    constructor(private context: string) {}

    debug = (message: string, data?: object): void => {
        this.logger.debug(this.createLogWithData(message, data))
    }

    info = (message: string, data?: object): void => {
        this.logger.info(this.createLogWithData(message, data))
    }

    warn = (message: string, data?: object): void => {
        this.logger.warn(this.createLogWithData(message, data))
    }

    error = (message: string, error?: object): void => {
        this.logger.error(this.createLogWithData(message, error))
    }

    private createLogWithData = (message: string, data?: object) => {
        const log: Log = {
            context: this.context,
            message,
        }
        if (data) log.data = data
        return log
    }
}

export const createLoggerWithContext = (context: string): LoggerService => {
    return new LoggerService(context)
}
