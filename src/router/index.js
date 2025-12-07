import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/LogInPage.vue'
import MyWebLayout from '../views/layouts/MyWebLayout.vue'
import AdminWebLayout from '@/views/layouts/AdminWebLayout.vue'
import MainPage from '../views/UserPages/MainPage.vue'
import DashBoardPage from '../views/UserPages/DashBoardPage.vue'
import SignUpPage from '../views/SignUpPage.vue'
import ProfilePage from '../views/UserPages/ProfilePage.vue'
import History from '../views/UserPages/HistoryPage.vue'
import ActivityLogPage from '@/views/AdminPages/ActivityLogPage.vue'
import AdminDashBoard from '@/views/AdminPages/AdminDashBoard.vue'
import UsersPage from '@/views/AdminPages/UsersPage.vue'
import EditPage from '@/views/UserPages/EditPage.vue'
import UserActivityPage from '@/views/AdminPages/UserActivityPage.vue'

const routes = [
  {
    path: '/',
    name: 'login',
    component: HomeView
  },
  {
    path: '/register',
    name: 'register',
    component: SignUpPage
  },
  {
    path: '/main',
    name: 'MainComponent',
    component: MyWebLayout,
    children: [
      {
        path: '',
        name: 'MainPage',
        component: MainPage, 
      },
      {
        path: 'dashboard',
        name: 'DashboardPage',
        component: DashBoardPage,
      },
      {
        path: 'history',
        name: 'HistoryPage',
        component: History,
      },
      {
        path: 'profile',
        name: 'ProfilePage',
        component: ProfilePage,
      },
      {
        path: 'editpage',
        name: 'EditPage',
        component: EditPage,
      }
    ]
  },
  {
    path: '/admin',
    name: 'AdminPage',
    component: AdminWebLayout,
    children: [
      {
        path: '',
        name: 'AdminDashboard',
        component: AdminDashBoard,

      },
      {
        path: 'activity-logs',
        name: 'ActivityLogPage',
        component: ActivityLogPage,
      },
      {
        path: 'users',
        name: 'UsersPage',
        component: UsersPage,
      },
      {
        path: 'user-actions',
        name: 'UserActivityPage',
        component: UserActivityPage,
      }
    ]

  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
