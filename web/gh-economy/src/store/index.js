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
  },
  state() {
    return {
      user: {},
      loggedIn: false,
      currentBet: {},
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
    }
  }
});
