<template>
  <div class="d-flex flex-column align-start">
    <span
      >Sold by <b>{{ announcement.user.props.name }}</b></span
    >

    <div class="d-flex">
      <div class="d-flex flex-column">
        <span
          style="font-size: 13px; color: rgb(53, 56, 64) !important"
          class="mr-2 mt-4"
          >price</span
        >

        <div class="d-flex align-center mb-8">
          <img width="28" src="../assets/coin.png" />
          <span class="ml-1 mt-2">{{ announcement.valuePerItem }}</span>
        </div>

        <v-btn @click="buy" class="btn-buy">buy</v-btn>
      </div>

      <div class="d-flex flex-column ml-12">
        <span
          style="font-size: 13px; color: rgb(53, 56, 64) !important"
          class="mr-2 mt-4"
          >yield</span
        >

        <div class="d-flex align-center mb-8">
          <img width="28" src="../assets/yield.png" />
          <span class="ml-1 mt-2">{{ item.yield }}</span>
        </div>

        <v-btn @click="buy" class="btn-buy">buy</v-btn>
      </div>
    </div>
  </div>
</template>

<script>
import { ask } from "../api/trade";

export default {
  name: "AnnouncementItem",

  props: ["announcement", "item"],

  data() {
    return {
      quantity: 1,
    };
  },

  methods: {
    buy() {
      ask(this.announcement.id, this.quantity).then(() =>
        alert("operation successfully")
      );
    },
  },
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Poppins&display=swap");

* {
  font-family: "Poppins" !important;
  font-weight: bold;
}

.btn-buy {
  position: absolute;
  bottom: 0;
  width: 100%;
  left: 0;
  background-color: rgb(32, 129, 226);
  height: 42px;
  color: white;
}
</style>