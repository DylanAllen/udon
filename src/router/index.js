import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
import Signup from '@/components/Signup'
import Login from '@/components/Login'
import Account from '@/components/Account'
import Client from '@/components/Client'
import AddClient from '@/components/AddClient'
import AddProject from '@/components/AddProject'
import Projects from '@/components/Projects'
import TimeLog from '@/components/HourLog'
import Report from '@/components/Report'
import NotFound from '@/components/NotFound'
import Verify from '@/components/Verify'
import firebase from 'firebase'

Vue.use(Router)

let router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Root',
      component: Home,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/home',
      name: 'Home',
      component: Home,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/signup',
      name: 'Signup',
      component: Signup
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/account',
      name: 'Account',
      component: Account,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/clients',
      name: 'Clients',
      component: Client,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/addclient',
      name: 'Add Client',
      component: AddClient,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/addproject',
      name: 'Add Project',
      component: AddProject,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/project/:project',
      name: 'Projects',
      component: Projects,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/timelog',
      name: 'Time Log',
      component: TimeLog,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/mytimelog',
      name: 'User Time Log',
      component: TimeLog,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/report',
      name: 'Report',
      component: Report,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/verify',
      name: 'Verify',
      component: Verify
    },
    {
      path: '*',
      name: 'NotFound',
      component: NotFound
    }
  ]
})

router.beforeEach((to, from, next) => {
  let currentUser = firebase.auth().currentUser
  let requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  let emailVerified = (!currentUser) ? false : currentUser.emailVerified
  if (requiresAuth && !currentUser) {
    next('login')
  } else if (requiresAuth && !emailVerified) {
    next('verify')
  } else next()
})

export default router
