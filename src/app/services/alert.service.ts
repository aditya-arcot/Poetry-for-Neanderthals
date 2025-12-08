import { Injectable } from '@angular/core'
import { AlertTypeEnum } from '@enums'
import { Alert } from '@models'
import { LoggerService } from '@services'
import { capitalizeFirstLetter } from '@utilities'
import { BehaviorSubject, Observable } from 'rxjs'
import { v4 as uuid } from 'uuid'

@Injectable({
    providedIn: 'root',
})
export class AlertService {
    private alerts: Alert[] = []
    private alertSubject = new BehaviorSubject<Alert[]>([])

    getAlerts = (): Observable<Alert[]> => {
        return this.alertSubject.asObservable()
    }

    addSuccessAlert = (
        logger: LoggerService,
        message: string,
        ...subtext: string[]
    ): void => {
        this.addAlert(AlertTypeEnum.Success, message, subtext)
        if (subtext.length) logger.info(message, { subtext })
        else logger.info(message)
    }

    addInfoAlert = (
        logger: LoggerService,
        message: string,
        ...subtext: string[]
    ): void => {
        this.addAlert(AlertTypeEnum.Info, message, subtext)
        if (subtext.length) logger.info(message, { subtext })
        else logger.info(message)
    }

    addErrorAlert = (
        logger: LoggerService,
        message: string,
        ...subtext: string[]
    ): void => {
        this.addAlert(AlertTypeEnum.Error, message, subtext)
        if (subtext.length) logger.error(message, { subtext })
        else logger.error(message)
    }

    private addAlert = (
        type: AlertTypeEnum,
        message: string,
        subtext: string[]
    ): void => {
        const alert: Alert = {
            id: uuid(),
            type,
            message: capitalizeFirstLetter(message.trim()),
            subtext: subtext.map((s) => capitalizeFirstLetter(s.trim())),
        }
        const timeout = setTimeout(
            () => {
                this.removeAlert(alert.id)
            },
            alert.type === AlertTypeEnum.Error ? 15000 : 5000
        )
        alert.timeout = timeout
        this.alerts.push(alert)
        this.alertSubject.next([...this.alerts])
    }

    removeAlert = (id: string): void => {
        const alertIdx = this.alerts.findIndex((n) => n.id === id)
        if (alertIdx === -1) return
        const alert = this.alerts[alertIdx]
        if (alert.timeout) clearTimeout(alert.timeout)
        this.alerts.splice(alertIdx, 1)
        this.alertSubject.next([...this.alerts])
    }
}
