import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
    {
        path: '',
        loadComponent: () => import('./business/home/home.component'),
        canActivate: [authGuard]
    },
    {
        path: 'login',
        loadComponent: () => import('./business/auth/login/login.component')
    },
    {
        path: 'register',
        loadComponent: () => import('./business/auth/register/register.component')
    }

];
