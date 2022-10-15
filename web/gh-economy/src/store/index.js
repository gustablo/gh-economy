import { createStore } from 'vuex';

export const store = createStore({
  getters: {
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
    }
  }
});
