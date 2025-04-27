import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
    {
        path: '',
        loadComponent: () => import('./business/home/home.component'),
    },
    {
        path: 'login',
        loadComponent: () => import('./business/auth/login/login.component')
    },
    {
        path: 'register',
        loadComponent: () => import('./business/auth/register/register.component')
    },
    {
        path: 'products',
        loadComponent: () => import('./business/products/products.component'),
    },
    {
        path: 'product/:id',
        loadComponent: () => import('./business/products/product-information/product-information.component'),
    },
    {
        path: 'cart',
        loadComponent: () => import('./business/cart/cart.component'),
        canActivate: [authGuard]
    },
    {
        path: 'checkout',
        loadComponent: () => import('./business/orders/orders.component'),
        canActivate: [authGuard]
    },
    {
        path: 'order-success',
        loadComponent: () => import('./business/orders/order-succes/order-succes.component'),
        canActivate: [authGuard]
    },
    {
        path: 'orders',
        loadComponent: () => import('./business/orders/show-orders/show-orders.component'),
        canActivate: [authGuard]
    },
    {
        path: 'admin',
        loadComponent: () => import('./business/admin/admin.component'),
        canActivate: [authGuard]
    }


];
