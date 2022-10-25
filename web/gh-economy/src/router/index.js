import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import { store } from '../store';
import { isEmpty } from 'lodash';
import { canActive } from './can-active';
import { execBeforeEach } from './before-each';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      beforeEnter: (guard, from, next) => {
        const user = store.getters.user;

        if (isEmpty(user)) {
          return next({ name: 'store' });
        }

        next();
      }
    },
    {
      path: '/store',
      name: 'store',
      component: () => import('../views/StoreView.vue')
    },
    {
      path: '/trades',
      name: 'proposals',
      component: () => import('../views/PendingTransactions.vue'),
      beforeEnter: (guard, from, next) => canActive(guard, from, next),
    },
    {
      path: '/wallet',
      name: 'wallet',
      component: () => import('../views/Wallet.vue'),
      beforeEnter: (guard, from, next) => canActive(guard, from, next),
    },
    {
      path: '/bets',
      name: 'bets',
      component: () => import('../views/BetsView.vue'),
      beforeEnter: (guard, from, next) => canActive(guard, from, next),
    },
    {
      path: '/game/:id',
      name: 'game',
      component: () => import('../views/BetGameView.vue'),
      beforeEnter: (guard, from, next) => canActive(guard, from, next),
    },
    {
      path: '/announcements/me',
      name: 'my announcements',
      component: () => import('../views/MyAnnouncements.vue'),
      beforeEnter: (guard, from, next) => canActive(guard, from, next),
    },
    {
      path: '/rankings',
      name: 'rankings',
      component: () => import('../views/RankingView.vue'),
      beforeEnter: (guard, from, next) => canActive(guard, from, next),
    },
  ]
})

execBeforeEach(router);

export default router;
