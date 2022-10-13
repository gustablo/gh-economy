import { createStore } from 'vuex';

export const store = createStore({
    getters: {
      user(state) {
        return state.user;
      },
      loggedIn(state) {
        return state.loggedIn || !!localStorage.getItem('token');
      }
    },
    state () {
      return {
        user: {},
        loggedIn: false,
      }
    },
    mutations: {
      setUser (state, user) {
        state.user = user;
      },
      setLoggedIn(state, loggedIn) {
        state.loggedIn = loggedIn;
      },
    }
});
