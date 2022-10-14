<template>
  <div>
    <div v-if="currentBet.step == 1">
        <div v-if="!currentBet.isChallenger">
            <span>make your choice</span>
            <v-btn @click="makeChoice(0)">heads</v-btn>
            <v-btn @click="makeChoice(1)">tails</v-btn>
        </div>
        <div v-else>
            <span>WAITING ENEMY MAKE CHOICE...</span>
        </div>
    </div>

    <div v-if="currentBet.step == 2">
        <div v-if="currentBet.isChallenger">
            <span>enemy choose {{ currentBet.enemyChoice }}</span>
        </div>

        <span>The game will start soon...</span>

    </div>

    <div v-if="currentBet.step == 3">
        the result is: {{ currentBet.result }}
    </div>

    <div v-if="currentBet.step == 4">
        <span v-if="currentBet.win">congratulations you win!</span>
        <span v-else>you are a fucking loser</span>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  computed: {
    ...mapGetters(["currentBet"]),
  },

  methods: {
    makeChoice(choice) {
      this.$socket.emit("made_choice", {
        choice,
        challengerId: this.currentBet.challengerId,
        betId: this.currentBet.id,
      });
      this.showChoice = false;
    },
  },
};
</script>

<style scoped>
</style>