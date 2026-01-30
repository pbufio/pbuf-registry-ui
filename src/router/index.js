import {createRouter, createWebHistory} from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import ModulesView from '@/views/ModulesView.vue'
import ModuleDetailView from '@/views/ModuleDetailView.vue'
import ModuleVersionView from '@/views/ModuleVersionView.vue'
import LoginView from '@/views/LoginView.vue'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/login',
            name: 'login',
            component: LoginView
        },
        {
            path: '/',
            name: 'home',
            component: HomeView
        },
        {
            path: '/modules',
            name: 'modules',
            component: ModulesView
        },
        {
            path: '/modules/:name+/tags/:tag',
            name: 'module-version',
            component: ModuleVersionView
        },
        {
            path: '/modules/:name+',
            name: 'module-detail',
            component: ModuleDetailView
        },
    ]
})

export default router
