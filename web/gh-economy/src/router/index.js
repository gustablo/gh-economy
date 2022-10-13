import { createRouter, createWebHistory } from 'vue-router'
import { store } from '../store';
import { current } from '../api/auth';
import HomeView from '../views/HomeView.vue'
import { isEmpty } from 'lodash';

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
      name: 'trades',
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
  ]
})

const canActive = (guard, from, next) =>{
  if (!localStorage.getItem('token')) return next({ path: from.path });

  return next();
}

router.beforeEach(async (guard, from, next) => {
  const token = localStorage.getItem('token');
  const user = store.state.user;

  if (token && isEmpty(user)) {
    try {
      const response = await current();
      store.commit('setUser', response);
    } catch (err) {
      localStorage.removeItem('token');
      return next({ name: 'home' });
    }

  }

  next();
});

export default router
