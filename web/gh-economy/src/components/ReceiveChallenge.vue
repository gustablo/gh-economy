<template>
  <v-dialog v-model="dialog" width="350" persistent>
    <v-card style="border-radius: 10px !important" class="pa-4">
      <h3>{{ bet.challengerName }} challenged you to a game!</h3>
      <div class="d-flex flex-column mt-6" style="gap: 8px">
        <span class="d-flex align-center"
          ><b>bet value:</b> <img width="18" class="ml-2 mr-1" src="../assets/coin.png" />
          <b style="margin-top: 1px">{{ bet.amount }}</b></span
        >
        <span><b>game:</b> {{ bet.game }}</span>
      </div>

      <v-divider class="mt-6" ></v-divider>

      <v-card-actions>
        <div class="d-flex justify-end mt-2" style="width: 100%; gap: 16px">
          <v-btn @click="answerBet('DENY')" style="background: red" class="receive-btn">DENY</v-btn>
          <v-btn @click="answerBet('ACCEPT')" class="receive-btn">ACCEPT</v-btn>
        </div>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';
export default {
  props: ["dialog", "bet"],

  computed: {
    ...mapGetters(['user']),
  },

  methods: {
    ...mapMutations(['setSnackbar']),

    answerBet(answer) {
      this.$emit('onclose');

      if (answer === 'ACCEPT' && Number(this.bet.amount) > Number(this.user.wallet.props.balance)) {
        return this.setSnackbar({ open: true, text: 'You do not have coins enough', color: 'error' });
      }

      this.$socket.emit("answer_challenge", {
        answer,
        challengerId: this.bet.challengerId,
        betId: this.bet.betId,
      });
    },
  },

  watch: {
    dialog: {
      handler(v) {
        if (!v) {
          this.$emit("onclose");
        }
      },
    },
  },
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Poppins&display=swap");

* {
  font-family: "Poppins" !important;
}

.receive-btn {
  background-color: rgb(32, 129, 226);
  color: white;
}
</style>