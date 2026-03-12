import { getCurrentUser } from 'aws-amplify/auth';

export default defineNuxtRouteMiddleware(async (to) => {
  if (import.meta.server) return;

  let isAuthenticated = false;
  try {
    await getCurrentUser();
    isAuthenticated = true;
  } catch {
    isAuthenticated = false;
  }

  if (to.path === '/login' && isAuthenticated) {
    return navigateTo('/');
  }

  if (to.path !== '/login' && !isAuthenticated) {
    return navigateTo('/login');
  }
});
