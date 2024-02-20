import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';
import HomeView from '@/views/HomeView.vue';
import ExerciseSession from '@/views/ExerciseSession.vue';
import ReviewSession from '@/views/ReviewSession.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    component: HomeView,
  },
  {
    path: '/unit/:unitIndex',
    component: ExerciseSession,
  },
  {
    path: '/unit/:unitIndex(\\d+)/review',
    component: ReviewSession,
  },
  {
    path: '/privacy',
    name: 'Privacy policy',
    component: () => import('@/views/PrivacyPolicy.vue'),
  },
  {
    path: '/about',
    name: 'About',
    component: () => import('@/views/AboutView.vue'),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
