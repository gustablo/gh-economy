<template>
  <v-dialog v-model="dialog" width="500">
    <v-card>
      <h2>VOCE RECEBEU UM CONVITE DE APOSTA DE {{ bet.challengerId }}</h2>
      <span>de R${{ bet.amount }}</span>
      <span> no jogo {{ bet.game }}</span>

      <v-btn @click="answerBet()">ACCEPT</v-btn>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: ["dialog", "bet"],

  methods: {
    answerBet() {
        this.$socket.emit('answer_challenge', {
            answer: 'ACCEPT',
            challengerId: this.bet.challengerId,
        })
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

<style>
</style>