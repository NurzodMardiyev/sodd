import AppLayout from '@/layout/AppLayout.vue';
import { createRouter, createWebHistory } from 'vue-router';

const routes = [
    {
        path: '/',
        component: AppLayout,
        children: [
            { path: '', redirect: '/dashboard' },
            { path: 'dashboard', name: 'dashboard', component: () => import('@/views/Dashboard.vue') },
            { path: ':pathMatch(.*)*', redirect: '/dashboard' }
        ]
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

export default router;
