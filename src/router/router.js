import {createRouter, createWebHistory} from 'vue-router'
const router = createRouter({
   history: createWebHistory(),
   routes: [
      {path: "/", meta: { auth: false,title: 'Admin' },component: () => import("../views/Admin2.vue"),
         children:[
            {path: '/', meta: { auth: false,title: 'Home' },  component: () => import(/* webpackChunkName: "Principal" */ '../views/admin2/Principal.vue')},
         ]
      },
      {
         path: '/:pathMatch(.*)*',
         name: 'not-found',
         meta: {title:'Not Found'},
         component: () => import(/* webpackChunkName: "404" */ '../views/404.vue')
      },

   ]
})

router.beforeEach((to) => {
   document.title = 'Pdf Search'
   const token = sessionStorage.getItem('token');
   if (to.meta.auth && !token) return '/'

   // título normal das páginas
   document.title = `${to.meta?.title ?? ''}${to.meta?.title ? ' - ' : ''}Pdf Search`
});

export default router
