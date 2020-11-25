import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/Home.vue'),
  },
  {
    path: '/lesson/:id',
    component: () => import('@/views/Session.vue'),
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ '@/views/About.vue'),
  },
  // examples
  {
    path: '/hello',
    name: 'HelloWorld',
    component: () =>
      import(/* webpackChunkName: "hello" */ '@/examples/HelloWorld.vue'),
  },
  {
    path: '/instr-mix',
    name: 'InstrMix',
    component: () =>
      import(
        /* webpackChunkName: "test-instr-mix" */ '@/examples/TestInstructionsMixin.vue'
      ),
  },
  {
    path: '/instr-play',
    name: 'InstrPlay',
    component: () =>
      import(
        /* webpackChunkName: "test-instr-play" */ '@/examples/TestInstructionsPlayer.vue'
      ),
  },
  {
    path: '/instr-wrap',
    name: 'InstrWrap',
    component: () =>
      import(
        /* webpackChunkName: "test-instr-wrap" */ '@/examples/TestInstructionsWrapper.vue'
      ),
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

export default router;
