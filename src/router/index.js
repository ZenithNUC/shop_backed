import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/login'
import Home from '../components/Home'
import Welcome from '../components/Welcome/welcome'
import Users from '../components/Users/users'
import Rights from '../components/Rights/rights'
import Roles from '../components/Rights/roles'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/welcome'
  },
  {
    path: '/login',
    component: Login
  },
  {
    path: '/home',
    component: Home,
    redirect: '/welcome',
    children: [
      {
        path: '/welcome',
        component: Welcome
      },
      {
        path: '/users',
        component: Users
      },
      {
        path: '/roles',
        component: Roles
      },
      {
        path: '/rights',
        component: Rights
      }
    ]
  }
]

const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
  if (to.path === '/login') {
    next()
  }
  const tokenStr = window.sessionStorage.getItem('token')
  if (!tokenStr) {
    next('/login')
  }
  next()
})

export default router
