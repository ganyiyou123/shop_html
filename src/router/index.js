import Vue from 'vue'
import Router from 'vue-router'
import Header from '@/components/common/Header'
import Test from '@/components/Tess'
import Home from '@/components/common/Home'
import Left from '@/components/common/Sidebar'
import Tag from '@/components/common/Tags'


Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/Tess'
    },
    {
      path: '/',
      component: () => import(/* webpackChunkName: "home" */ '../components/common/Home.vue'),
      meta: { title: '自述文件' },
      children: [
        {
          path: '/Tess',
          component: () => import(/* webpackChunkName: "dashboard" */ '../components/Tess.vue'),
          meta: { title: '系统首页' }
        },
        {
          path: '/Type',
          component: () => import(/* webpackChunkName: "dashboard" */ '../components/shop/Type.vue'),
          meta: { title: '分类管理' }
        },
        {
          path: '/Pinpai',
          component: () => import(/* webpackChunkName: "dashboard" */ '../components/pinpaiVue/Pinpai.vue'),
          meta: { title: '品牌管理' }
        },
        {
          path: '/Data',
          component: () => import(/* webpackChunkName: "dashboard" */ '../components/pinpaiVue/Data.vue'),
          meta: { title: '属性管理' }
        },{
          path: '/Goods2',
          component: () => import(/* webpackChunkName: "dashboard" */ '../components/pinpaiVue/Goods2.vue'),
          meta: { title: '商品新增' }
        },
        {
          path: '/GoodsDatas',
          component: () => import(/* webpackChunkName: "dashboard" */ '../components/pinpaiVue/GoodsDatas.vue'),
          meta: { title: '商品管理' }
        }


      ]
    },{
      path: '/UserZ',
      component: () => import(/* webpackChunkName: "dashboard" */ '../components/user/UserZ.vue'),
      meta: { title: '用户登录' }
    }
  ]
})
