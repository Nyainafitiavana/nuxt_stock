import { defineNuxtRouteMiddleware, navigateTo } from 'nuxt/app';

export default defineNuxtRouteMiddleware((to, from) => {
    if (typeof window !== 'undefined') {
        const userConnect = localStorage.getItem('userConnect');
        if (!userConnect || userConnect !== 'true') {
            window.location.href = RouteList.LOGIN;
        }
    }
});


