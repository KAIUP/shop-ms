import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from 'views/login/Login'
import Home from 'views/home/Home'
import Welcome from 'components/welcome/Welcome'
import Users from 'components/user/Users'

Vue.use(VueRouter)

const routes = [{
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    component: Login
  },
  {
    path: '/home',
    component: Home,
    redirect: '/welcome',
    children: [{
        path: '/welcome',
        component: Welcome
      },
      {
        path: '/users',
        component: Users
      }
    ]
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

//挂载路由导航守卫
router.beforeEach((to, from, next) => {
  // next是一个函数,表示放行
  // next() 直接放行 或 next('/login') 强制跳转
  if (to.path === '/login') return next() //访问登陆页直接放行

  // 获取 token进行判断
  const tokenStr = window.sessionStorage.getItem('token')
  if (!tokenStr) return next('/login') //没有 token 强制跳转登陆页
  next() //携带 token 则直接放行
})

export default router