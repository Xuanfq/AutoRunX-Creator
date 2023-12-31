import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

const routes = [{
    name: 'index',
    path: '/',
    component: () => import('@/views/home/index'),
    meta: {
        title: 'AutoRunX Editor',
        keepAlive: true, // 需要被缓存
    }
}, {
    name: 'home',
    path: '/home',
    component: () => import('@/views/home/index'),
    meta: {
        title: 'AutoRunX',
        keepAlive: true, // 需要被缓存
    }
}, {
    name: 'creater',
    path: '/creater',
    component: () => import('@/views/home/index'),
    meta: {
        title: 'AutoRunX',
        keepAlive: true, // 需要被缓存
    }
}]

const router = new Router({
    mode: "hash",
    routes, // `routes: routes` 的缩写
})

export default router
