import { createStore } from 'vuex';

export const store = createStore({
  getters: {
    route(state) {
      return state.route;
    },
    user(state) {
      return state.user;
    },
    loggedIn(state) {
      return state.loggedIn || !!localStorage.getItem('token');
    },
    currentBet(state) {
      return state.currentBet;
    },
    snackbar(state) {
      return state.snackbar;
    }
  },
  state() {
    return {
      user: {},
      loggedIn: false,
      currentBet: {},
      route: '',
      snackbar: {
        open: false,
        text: '',
        color: 'error',
      }
    }
  },
  mutations: {
    setUser(state, user) {
      state.user = user;
    },
    setLoggedIn(state, loggedIn) {
      state.loggedIn = loggedIn;
    },
    setCurrentBet(state, bet) {
      state.currentBet = { ...state.currentBet, ...bet };
    },
    setSnackbar(state, snackbar) {
      state.snackbar = { ...state.snackbar, ...snackbar };
    },
    setRoute(state, route) {
      state.route = route;
    }
  }
});
