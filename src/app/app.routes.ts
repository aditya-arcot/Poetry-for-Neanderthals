import { Routes } from '@angular/router'
import { RouteEnum as Route } from '@enums'

export const routes: Routes = [
    {
        path: 'startup-error',
        loadComponent: () =>
            import('./pages/startup-error/startup-error.component').then(
                (m) => m.StartupErrorComponent
            ),
    },
    {
        path: 'home',
        loadComponent: () =>
            import('./pages/home/home.component').then((m) => m.HomeComponent),
    },
    {
        path: '**',
        redirectTo: Route.Home,
    },
]
