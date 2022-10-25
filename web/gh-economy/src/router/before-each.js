import { isEmpty } from "lodash";
import { current } from "../api/auth";
import { store } from "../store";

export const execBeforeEach = (router) => {
    router.beforeEach(async (guard, _, next) => {
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

        store.commit('setRoute', guard.name);
        next();
    });
};
