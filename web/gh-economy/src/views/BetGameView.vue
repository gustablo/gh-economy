<template>
  <div class="h-full">
    <div v-if="currentBet.step == 1" class="h-full">
      <div class="d-flex justify-center align-center h-full flex-column">
        <h1 style="margin-top: -60px">{{ initialText }}</h1>
        <div class="d-flex align-center justify-center mt-16" style="gap: 52px">
          <v-tooltip location="left" text="Heads">
            <template v-slot:activator="{ props }">
              <div
                v-bind="props"
                @click="makeChoice('heads')"
                class="heads-img choice-img"
                :style="{
                  cursor: currentBet.isChallenger ? 'auto' : 'pointer',
                }"
              ></div>
            </template>
          </v-tooltip>

          <h1><b>OR</b></h1>

          <v-tooltip location="right" text="Tails">
            <template v-slot:activator="{ props }">
              <div
                v-bind="props"
                :style="{
                  cursor: currentBet.isChallenger ? 'auto' : 'pointer',
                }"
                @click="makeChoice('tails')"
                class="tails-img choice-img"
              ></div>
            </template>
          </v-tooltip>
        </div>
      </div>
    </div>

    <div
      v-if="currentBet.step == 2"
      class="h-full d-flex flex-column justify-center align-center"
    >
      <div
        :class="{
          'side-a': true,
          [(currentBet.isChallenger
            ? coinMap[oppositeChoice]
            : coinMap[myChoice]) + '-img']: true,
          'choice-img': true,
          'h-full': true,
          'd-flex': true,
          'justify-center': true,
          'align-center': true,
        }"
      ></div>
    </div>

    <div
      v-if="currentBet.step == 3"
      class="h-full d-flex justify-center align-center"
    >
      <div id="coin" :class="currentBet.result">
        <div class="side-a heads-img"></div>
        <div class="side-b tails-img"></div>
      </div>
    </div>

    <div
      v-if="currentBet.step == 4"
      class="h-full d-flex flex-column justify-center align-center"
    >
      <div
        :class="{
          'side-a': true,
          [currentBet.result + '-img']: true,
          'choice-img': true,
        }"
      ></div>
      <span v-if="currentBet.win">congratulations you win!</span>
      <span v-else>you are a fucking loser</span>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";
import { coin } from "../constants/coin";

export default {
  computed: {
    ...mapGetters(["currentBet"]),

    initialText() {
      if (this.currentBet.isChallenger) {
        return "Wait the enemy select";
      }

      return "Select heads or tails";
    },
    oppositeChoice() {
      return Number(this.invertedCoinObj[this.currentBet.enemyChoice]) * -1 + 1;
    },
    invertedCoinObj() {
      return Object.keys(coin).reduce((acc, cur) => {
        acc[coin[cur]] = cur;

        return acc;
      }, {});
    },
  },

  mounted() {},

  data: () => ({
    coinMap: coin,
    myChoice: null,
  }),

  methods: {
    ...mapMutations(["setCurrentBet"]),
    makeChoice(choice) {
      if (this.currentBet.isChallenger) return;

      this.myChoice = this.invertedCoinObj[choice];

      this.$socket.emit("made_choice", {
        choice: this.myChoice,
        challengerId: this.currentBet.challengerId,
        betId: this.currentBet.id,
      });
    },
  },
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Poppins&display=swap");

* {
  font-family: "Poppins" !important;
}

#coin div {
  width: 100%;
  height: 100%;
  -webkit-border-radius: 50%;
  -moz-border-radius: 50%;
  border-radius: 50%;
  -webkit-box-shadow: inset 0 0 45px rgba(255, 255, 255, 0.3),
    0 12px 20px -10px rgba(0, 0, 0, 0.4);
  -moz-box-shadow: inset 0 0 45px rgba(255, 255, 255, 0.3),
    0 12px 20px -10px rgba(0, 0, 0, 0.4);
  box-shadow: inset 0 0 45px rgba(255, 255, 255, 0.3),
    0 12px 20px -10px rgba(0, 0, 0, 0.4);
}

.heads-img {
  background-image: url("../assets/heads.png");
  background-size: cover;
  background-repeat: no-repeat;
}

.h-full {
  height: 100%;
}

.tails-img {
  background-image: url("../assets/tails.png");
  background-size: cover;
  background-repeat: no-repeat;
}

.side-a {
  width: 100%;
  height: 100%;
}
.side-b {
  width: 100%;
  height: 100%;
}

.choice-img {
  width: 200px;
  height: 200px;
}

#coin {
  transition: -webkit-transform 1s ease-in;
  -webkit-transform-style: preserve-3d;
  width: 200px;
  height: 200px;
}
#coin div {
  position: absolute;
  -webkit-backface-visibility: hidden;
}

.side-a {
  z-index: 100;
}
.side-b {
  -webkit-transform: rotateY(-180deg);
}

#coin.heads {
  -webkit-animation: flipHeads 5s ease-out forwards;
  -moz-animation: flipHeads 5s ease-out forwards;
  -o-animation: flipHeads 5s ease-out forwards;
  animation: flipHeads 5s ease-out forwards;
}
#coin.tails {
  -webkit-animation: flipTails 5s ease-out forwards;
  -moz-animation: flipTails 5s ease-out forwards;
  -o-animation: flipTails 5s ease-out forwards;
  animation: flipTails 5s ease-out forwards;
}

@-webkit-keyframes flipHeads {
  from {
    -webkit-transform: rotateY(0);
    -moz-transform: rotateY(0);
    transform: rotateY(0);
  }
  to {
    -webkit-transform: rotateY(1800deg);
    -moz-transform: rotateY(1800deg);
    transform: rotateY(1800deg);
  }
}
@-webkit-keyframes flipTails {
  from {
    -webkit-transform: rotateY(0);
    -moz-transform: rotateY(0);
    transform: rotateY(0);
  }
  to {
    -webkit-transform: rotateY(1980deg);
    -moz-transform: rotateY(1980deg);
    transform: rotateY(1980deg);
  }
}
</style>