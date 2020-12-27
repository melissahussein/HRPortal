import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

var routes = [
    // Homepage + login
    {
        path: '/dashboard',
        name: 'dashboard',

        // Chargement synchrone du composant de webpack
        component: require('./views/dashboard/dashboard.vue')

        // ... OU ...

        // Chargement asynchrone du composant de webpack
        // component: resole => require(['./views/dashboard/dashboard.vue'], resolve)
    },

    {
        path: '/',
        name: 'login-form',
        component: require('./components/login-form.vue')
    },

    //Files
    {
        path: '/employees/files/:id',
        name: 'file',
        component:require('./views/files/file.vue')
    },
    {
        path: '/employees/files/edit/:id',
        name: 'file-add',
        component: require('./views/files/file-add.vue')
    },

    //Modes
    {
        path: '/admin/:username',
        name: 'board-admin',
        component: require('./views/pages/BoardAdmin.vue')
    },
    {
        path: '/LR/:username',
        name: 'board-LR',
        component: require('./views/pages/BoardLegalRepresentative.vue')
    },
    {
        path: '/HR/:username',
        name: 'board-HR',
        component: require('./views/pages/BoardHRManager.vue')
    },

    // Admins
    {
        path: '/admins',
        component: require('./views/persons/admins/admins.vue'),
        // component: resolve => require(['./views/persons/admins/admins.vue'], resolve),
        name: 'admins'
    },
    {
        path: '/admins/edit/:id',
        component: require('./views/persons/admins/admin-profile.vue'),
        // component: resolve => require(['./views/persons/admins/admin-profile.vue'], resolve),
        name: 'admin-profile'
    },

    // Users
    {
        path: '/users',
        component: require('./views/persons/users/users.vue'),
        // component: resolve => require(['./views/persons/users/users.vue'], resolve),
        name: 'users'
    },
    {
        path: '/users/edit/:id',
        component: require('./views/persons/users/user-profile.vue'),
        // component: resolve => require(['./views/persons/users/user-profile.vue'], resolve),
        name: 'user-profile'
    },
    {
        path: '/users/add',
        component: require('./views/persons/users/user-add.vue'),
        // component: resolve => require(['./views/persons/users/user-add.vue'], resolve),
        name: 'user-add'
    },

    // Employees
    {
        path: '/companies/:name',
        component: require('./views/persons/employees/employees.vue'),
        name: 'employees'
    },
    {
        path: '/employees/edit/:id',
        component: require('./views/persons/employees/employee-profile.vue'),
        name: 'employee-profile'
    },
    
    {
        path: '/register/:name',
        component: require('./views/persons/employees/employee-register.vue'),
        name: 'employee-register'
    },
    {
        path: '/viewregister/:name',
        component: require('./views/persons/employees/view-register.vue'),
        name: 'view-register'
    },
    {
        path: '/leavingregister/:id',
        component: require('./views/persons/employees/leaving-register.vue'),
        name: 'leaving-register'
    },
    {
        path: '/employees/add',
        component: require('./views/persons/employees/employee-add.vue'),
        name: 'employee-add'
    },
    {
        path: '/monthly-planning/:name',
        component: require('./views/persons/employees/monthly-planning.vue'),
        name: 'monthly-planning'
    },
    {
        path: '/monthly-planning/:id',
        component: require('./views/persons/employees/monthly-planning-add.vue'),
        name: 'monthly-planning-add'
    },
    {
        path: '/employees/planning/:id',
        component: require('./views/persons/employees/monthly-planning-all.vue'),
        name: 'monthly-planning-all'
    },
    // Companies
    {
        path: '/companies',
        component: require('./views/companies/companies.vue'),
        name: 'companies'
    },
    {
        path: '/payrolls',
        component: require('./views/companies/companies-payroll.vue'),
        name: 'companies-payroll'
    },
    {
        path: '/companies/:firstname/:lastname',
        component: require('./views/companies/company-add.vue'),
        name: 'company-add'
    },
    {
        path: '/companies/add',
        component: require('./views/companies/company-add.vue'),
        name: 'company-add'
    },
    //Payrolls
    {
        path: '/payrolls',
        component: require('./views/companies/companies-payroll.vue'),
        name: 'companies-payroll'
    },


    // 404 -> redirect to Dashboard
    {
        path: '*',
        redirect: '/'
    }
]

var router = new VueRouter({
    mode: 'hash',
    routes: routes,
    scrollBehavior (to, from, savedPosition) {

        // In the exemple below, if the user change route, the new view scroll to 0,0 position (top of page)
        if (savedPosition) {

            return savedPosition

        } else {

            return {
                x: 0,
                y: 0
            }

        }

    }
})

export default router
