import { createRouter, createWebHistory } from 'vue-router';
import Home from '@/views/Home.vue';
import Session from '@/views/Session.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/lesson/:id',
    component: Session,
  },
  {
    path: '/privacy',
    name: 'Privacy policy',
    component: () => import('@/views/Privacy.vue'),
  },
  {
    path: '/about',
    name: 'About',
    component: () => import('@/views/About.vue'),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
