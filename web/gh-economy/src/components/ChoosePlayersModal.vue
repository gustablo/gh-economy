<template>
  <v-dialog v-model="dialog" width="500">
    <v-card>
      <div v-for="user in onlineUsers" :key="user.props.id" @click="selectedUser = user">
        <span>{{ user.props.name }}</span>
      </div>

      selected -> {{ selectedUser.props.socketId }}

      <gh-input v-model="amount" :placeholder="'bet value'" />
      <v-btn @click="bet">apostar</v-btn>
    </v-card>
  </v-dialog>
</template>

<script>
import { fetchOnlineUsers } from "../api/user";
import GhInput from './shared/GhInput.vue';

export default {
  components: { GhInput },
  name: "ChoosePlayersModal",

  props: ["dialog"],

  data: () => ({
    onlineUsers: [],
    amount: null,
    selectedUser: { props: { name: '' } },
  }),
  
  methods: {
    bet() {
      this.$socket.emit('ask_bet', {
          game: 'HEADS_OR_TAILS',
          amount: this.amount,
          challengedId: this.selectedUser.props.socketId,
      })

    }
  },

  watch: {
    dialog: {
      handler(v) {
        if (!v) {
          this.$emit("onclose");
        } else {
          fetchOnlineUsers()
            .then((users) => (this.onlineUsers = users));
        }
      },
    },
  },
};
</script>

<style>
</style>