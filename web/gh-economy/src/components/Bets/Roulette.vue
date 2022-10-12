<template>
  <div>
    <h1>Roulette</h1>

    <h3>Choose a color</h3>

    <div class="d-flex roulette-colors">
      <div
        id="c"
        v-for="c in colorsList"
        :key="c"
        v-bind:class="{
          'selected-color': color == c,
          circle: true,
          [`bg-${c.toLowerCase()}`]: true,
        }"
        @click="selectColor(c)"
      ></div>
    </div>

    <div class="d-flex mt-16 justify-space-around" style="width: 300px">
      <v-text-field
        type="number"
        label="Bet amount"
        v-model="amount"
      ></v-text-field>
      <v-btn @click="submitBet">Bet</v-btn>
    </div>

    <div v-if="correctColor">
      <h3>Result:</h3>
      <div :class="'circle' + ' bg-' + correctColor"></div>
    </div>
  </div>
</template>

<script>
import { bet } from "../../api/bet";

export default {
  name: "Roulette",

  data() {
    return {
      color: "",
      amount: 0,
      correctColor: "",
      colorsList: ["GREEN", "RED", "BLACK"],
    };
  },

  mounted() {
    const black = document.getElementById('BLACK');
    const green = document.getElementById('green');
    const blue = document.getElementById('blue');

    setInterval(() => {

    });
  },

  methods: {
    selectColor(color) {
      this.color = color;
    },
    submitBet() {
      bet("ROULETTE", this.amount, { color: this.color }).then(
        async (result) => {
          await this.animation();

          this.correctColor = result.options.color.toLowerCase();

          if (result.won) {
            alert(`you win! GH$${result.wonValue}`);
          } else {
            alert(`you lose GH$${result.lostValue}`);
          }
        }
      );
    },

    animation() {
      let counter = 0;
      let index = 0;

      return new Promise((resolve) => {
        const interval = setInterval(() => {
          if (index == this.colorsList.length) {
            index = 0;
          }

          this.correctColor = this.colorsList[index].toLowerCase();
          index++;

          counter++;

          if (counter == 10) {
            clearInterval(interval);
            return resolve();
          }
        }, 300);
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

.circle {
  height: 100px;
  width: 100px;
  border-radius: 50%;
  cursor: pointer;
  position: absolute;
}

.roulette-colors {
  transition: 0.3s;
  gap: 20px;
  width: 100px;
  position: relative;
}

.selected-color {
  border: 4px solid blue;
}
</style>