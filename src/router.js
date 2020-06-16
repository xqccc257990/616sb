import Vue from 'vue'
import Router from 'vue-router'
import store from './store'

Vue.use(Router)

export default new Router({
    mode: 'history',
    base: process.env.BASE_URL,
    routes: [{
        path: '/',
        component: () => import('./views/Login.vue')
    },
    {
        path: '/login',
        component: () => import('./views/Login.vue')
    },
    {
        path: '/main',
        component: () => import('./views/Main.vue'),
        children: [{
            path: 'user/list',
            component: () => import('./views/user/list.vue')
        },
        {
            path: 'user/detail/:type/:id',
            component: () => import('./views/user/detail.vue')
        },
        {
            path: 'user/overview/:type/:id',
            component: () => import('./views/user/overview.vue')
        },
        {
            path: 'user/batchAdd/:type/:id',
            component: () => import('./views/user/batchAdd.vue')
        },
        {
            path: 'log/list',
            component: () => import('./views/log/list.vue')
        },
        {
            path: 'device/list',
            component: () => import('./views/device/list.vue')
        },
        {
            path: 'device/detail/:type/:id',
            component: () => import('./views/device/detail.vue')
        },
        {
            path: 'device/:type/:id',
            component: () => import('./views/device/edit.vue')
        },
        {
            path: '/delivery/list',
            component: () => import('./views/delivery/list.vue')
        },

        { 
            path: 'delivery/detail/:type/:id',
            component: () => import('./views/delivery/detail.vue')
        },
        // {
        //     path: 'delivery/add',
        //     component: () => import('./views/delivery/add.vue')
        // },

        // 门组
        {
            path: 'doorGroup/list',
            component: () => import('./views/doorGroup/list.vue')
        },
        {
            path: 'doorGroup/detail/:type/:id',
            component: () => import('./views/doorGroup/detail.vue')
        },
        {
            path: 'doorGroup/overview/:type/:id',
            component: () => import('./views/doorGroup/overview.vue')
        },
        {
            path: 'advertising/list',
            component: () => import('./views/advertising/list.vue')
        },
        {
            path: 'advertising/detail/:type/:id',
            component: () => import('./views/advertising/detail.vue')
        },
        {
            path: 'adRelease/list',
            component: () => import('./views/adRelease/list.vue')
        },
        {
            path: 'adRelease/detail/:type/:id',
            component: () => import('./views/adRelease/detail.vue')
        },
        {
            path: 'record/list',
            component: () => import('./views/record/list.vue')
        },
        {
            path: 'record/detail/:type/:id',
            component: () => import('./views/record/detail.vue')
        },
        {
            path: 'attendance/list',
            component: () => import('./views/attendance/list.vue')
        },
        {
            path: 'attendance/detail/:type/:id',
            component: () => import('./views/attendance/detail.vue')
        },
        {
            path: 'department/list',
            component: () => import('./views/department/list.vue')
        },
        {
            path: 'department/detail/:type/:id',
            component: () => import('./views/department/detail.vue')
        },
        {
            path: 'plan/list',
            component: () => import('./views/plan/list.vue')
        },

        {
            path: 'plan/detail/:type/:id',
            component: () => import('./views/plan/detail.vue')
        },
        {
            path: 'statistics/attendanceList',
            component: () => import('./views/statistics/attendanceList.vue')
        },
        {
            path: 'statistics/cardList',
            component: () => import('./views/statistics/cardList.vue')
        },
        {
            path: 'userSet/main',
            component: () => import('./views/userSet/main.vue')
        },
        {
            path: 'userSet/password',
            component: () => import('./views/userSet/password.vue')
        },
        {
            path: 'sysUser/list',
            component: () => import('./views/sysUser/list.vue')
        },

        {
            path: 'sysUser/detail/:type/:id',
            component: () => import('./views/sysUser/detail.vue')
        },
        {
            path: 'sysRole/list',
            component: () => import('./views/sysRole/list.vue')
        },
        {
            path: 'sysRole/detail/:type/:id',
            component: () => import('./views/sysRole/detail.vue')
        },
        {
            path: 'sysMenu/list',
            component: () => import('./views/sysMenu/list.vue')
        },
        {
            path: 'tenant/list',
            component: () => import('./views/tenant/list.vue')
        },
        {
            path: 'tenant/detail/:type/:id',
            component: () => import('./views/tenant/detail.vue')
        },
        {
            path: 'softwareUpdate/list',
            component: () => import('./views/softwareUpdate/list.vue')
        },
        {
            path: 'softwareUpdate/detail/:type/:id',
            component: () => import('./views/softwareUpdate/detail.vue')
        }
        ]
        }
    ]
})