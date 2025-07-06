import { Component, OnInit, inject } from '@angular/core'
import { Router } from '@angular/router'
import { StartupService } from '@services'

@Component({
    templateUrl: './startup-error.component.html',
})
export class StartupErrorComponent implements OnInit {
    private startupSvc = inject(StartupService)
    private router = inject(Router)

    ngOnInit() {
        if (this.startupSvc.success) void this.router.navigateByUrl('/')
    }
}
