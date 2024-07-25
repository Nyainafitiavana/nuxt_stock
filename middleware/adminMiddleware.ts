import { defineNuxtRouteMiddleware, navigateTo } from 'nuxt/app';

export default defineNuxtRouteMiddleware(() => {
    if (typeof window !== 'undefined') {
        const userRole = localStorage.getItem('role');
        if (!userRole || userRole !== 'ADMIN') {
            window.location.href = RouteList.LOGIN;
        }
    }
});
