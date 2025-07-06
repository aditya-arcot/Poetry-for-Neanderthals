import { Routes } from '@angular/router'
import { RouteEnum as Route } from '@enums'

export const routes: Routes = [
    // TODO add routes
    {
        path: 'startup-error',
        loadComponent: () =>
            import('./pages/startup-error/startup-error.component').then(
                (m) => m.StartupErrorComponent
            ),
    },
    {
        path: '**',
        // TODO change redirect
        redirectTo: Route.Home,
    },
]
