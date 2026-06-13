import { createRouter, createWebHistory } from 'vue-router'
import AllView from './views/AllView.vue'
import HomeView from './views/HomeView.vue'
import UploadView from './views/UploadView.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'home', component: HomeView },
    { path: '/all', name: 'all', component: AllView },
    { path: '/upload', name: 'upload', component: UploadView },
  ],
  scrollBehavior: () => ({ top: 0 }),
})

export default router
