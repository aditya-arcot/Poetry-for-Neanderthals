import { createLoggerWithContext, LoggerService } from '@services'

export abstract class LoggerComponent {
    protected logger: LoggerService

    protected constructor(private context: string) {
        this.logger = createLoggerWithContext(this.context)
    }
}
