import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { store } from './store'
import vuetify from './plugins/vuetify'
import { loadFonts } from './plugins/webfontloader'

import VueSocketIO from 'vue-3-socket.io'
import SocketIO from 'socket.io-client'

const socketConnection = SocketIO(import.meta.env.VITE_SOCKET_ENDPOINT);

const socket = new VueSocketIO({
  debug: true,
  connection: socketConnection,
  vuex: {
    store,
    actionPrefix: 'SOCKET_',
    mutationPrefix: 'SOCKET_'
  },
});

loadFonts()

createApp(App)
  .use(router)
  .use(store)
  .use(vuetify)
  .use(socket)
  .mount('#app')
