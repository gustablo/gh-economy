<template>
  <div class="h-full">
    <div v-if="currentBet.step == 1" class="h-full">
      <div class="d-flex justify-center align-center h-full flex-column">
        <h1 style="margin-top: -48px">{{ initialText }}</h1>
        <div class="d-flex align-center justify-center" style="gap: 52px">
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
      :style="{ display: currentBet.step == 2 ? 'flex' : 'none' }"
      class="h-full flex-column justify-center align-center"
    >
      <div class="d-flex justify-center align-center h-full flex-column">
        <div class="d-flex align-center justify-center" style="gap: 52px">
          <div class="heads-img choice-img" id="head-coin"></div>

          <h1 id="or"><b>OR</b></h1>

          <div class="tails-img choice-img" id="tail-coin"></div>
        </div>
      </div>
    </div>

    <div v-if="currentBet.step == 3" class="h-full d-flex justify-center align-center">
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
    </div>
  </div>
</template>

<script>
import { nextTick } from "@vue/runtime-core";
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
    async sleep(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    },
    async startAnimation(coinElement, elementToHidden, operation) {
      let initial = 0;
      let opacity = 1;

      while (initial >= -350) {
        coinElement.style[operation == 'sub' ? 'marginLeft' : 'marginRight'] = Number(initial) + "px";
        elementToHidden.style.opacity = opacity;
        initial = Number(initial) - 10;
        opacity = opacity - 0.1;

        await this.sleep(10);
      }
    },
  },

  watch: {
    "currentBet.win": {
      handler(v) {
        nextTick(() => {
          console.log(v);
        });
      },
    },
    "currentBet.step": {
      handler(v) {
        if (v == 2) {
          setTimeout(() => {
            //trocar para nexttick
            const head = document.getElementById("head-coin");
            const tail = document.getElementById("tail-coin");

            head.style.opacity = '1';
            tail.style.opacity = '1';
            head.style.marginLeft = '0px';
            tail.style.marginLeft = '0px';
            head.style.marginRight = '0px';
            tail.style.marginRight = '0px';

            if (!head || !tail) return;

            document.getElementById("or").style.visibility = "hidden";

            if (this.currentBet.isChallenger) {
              if (this.currentBet.enemyChoice == "tails") {
                this.startAnimation(head, tail, "add");
              } else if (this.currentBet.enemyChoice == "heads") {
                this.startAnimation(tail, head, "sub");
              }
              return;
            }

            if (this.myChoice == 1) {
              this.startAnimation(tail, head, "sub");
            } else if (this.myChoice == 0) {
              this.startAnimation(head, tail, "add");
            }
          }, 10);
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