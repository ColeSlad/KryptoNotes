import { router } from 'expo-router';
import { AppRoute } from '@/types/routes';

export const navigateTo = (route: AppRoute) => {
  router.push(route as any);
};

export const replaceTo = (route: AppRoute) => {
  router.replace(route as any);
};

// import { navigateTo } from '@/utils/navigation';
// navigateTo('/Login');