import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';
import Home from '@/views/Home.vue';
import Session from '@/views/Session.vue';
import Review from '@/views/Review.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/lesson/:lessonIndex',
    component: Session,
  },
  {
    path: '/lesson/:lessonIndex(\\d+)/review',
    component: Review,
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
