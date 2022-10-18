<template>
  <v-card class="item-card d-flex flex-column align-center">
    <div
      class="img-card-item"
      :style="{ 'background-image': 'url(' + item.imageUrl + ')' }"
    ></div>

    <v-card-actions class="d-flex flex-column item-actions-card align-start">
      <b>{{ item.name }}</b>

      <div class="d-flex">
        <div class="d-flex flex-column">
          <span
            style="font-size: 13px; color: rgb(53, 56, 64) !important"
            class="mr-2 mt-4"
            >price</span
          >

          <div class="d-flex align-center mb-8">
            <img width="28" src="../assets/coin.png" />
            <span class="ml-1 mt-1">{{ announcement.valuePerItem }}</span>
          </div>

        </div>

        <div class="d-flex flex-column ml-6">
          <span
            style="font-size: 13px; color: rgb(53, 56, 64) !important"
            class="mr-2 mt-4"
            >yield</span
          >

          <div class="d-flex align-center mb-8">
            <img width="28" src="../assets/yield.png" />
            <span class="ml-1 mt-1">{{ item.yield }}</span>
          </div>
        </div>
      </div>

      <rarity :item="item"/>

      <v-btn
        style="width: 100%"
        class="mt-4 btn-sell"
        @click="openBuyItemModal(item)"
        v-if="loggedIn"
        >buy</v-btn
      >
    </v-card-actions>
    <buy-item-modal
      :dialog="dialog"
      :item="selectedItem"
      @onclose="dialog = false"
    />
  </v-card>
</template>

<script>
import { mapGetters } from "vuex";
import BuyItemModal from "./BuyItemModal.vue";
import Rarity from './shared/Rarity.vue';

export default {
  components: { BuyItemModal, Rarity, },
  name: "ItemCard",

  props: ["item"],

  computed: {
    ...mapGetters(["loggedIn"]),

    announcement() {
      return this.item.announcements[0];
    }
  },

  data() {
    return {
      dialog: false,
      selectedItem: {},
    };
  },

  methods: {
    openBuyItemModal(item) {
      this.selectedItem = item;
      this.dialog = true;
    },
  },
};
</script>

<style scoped>
.item-card {
  width: 350px;
  box-shadow: rgb(0 0 0 / 8%) 0px 4px 15px;
  position: relative;
  border-radius: 10px;
}

.item-card:hover {
  cursor: pointer;
}

llet-card {
  width: 350px;
  box-shadow: rgb(0 0 0 / 8%) 0px 4px 15px;
  position: relative;
  border-radius: 10px;
}

.img-card-item {
  width: 100%;
  height: 400px;
  position: relative;
  background-size: cover;
  background-repeat: no-repeat;
}

.item-actions-card {
  row-gap: 12px;
  width: 90%;
  margin-top: 16px;
}

.w-100 {
  width: 100%;
}

.btn-sell {
  transform: translateY(100%);
  transition: 0.3s;
  position: absolute;
  bottom: 0;
  background-color: rgb(32, 129, 226);
  color: white;
  left: 0;
}

.item-card:hover .btn-sell {
  transform: translateY(0);
}

.item-img {
  position: absolute;
  inset: 0px;
  box-sizing: border-box;
  padding: 0px;
  border: none;
  margin: auto;
  display: block;
  width: 0px;
  height: 0px;
  min-width: 100%;
  max-width: 100%;
  min-height: 100%;
  max-height: 100%;
  object-fit: contain;
}
</style>