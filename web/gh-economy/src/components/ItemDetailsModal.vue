<template>
  <v-dialog v-model="dialog" width="500">
    <v-card
      class="item-card d-flex flex-column align-center"
      style="border-radius: 10px !important"
    >
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
              >rarity</span
            >

            <div class="d-flex align-center mb-8">
              <span class="ml-1 mt-1"> <rarity :item="item" /></span>
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
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import Rarity from "./shared/Rarity.vue";

export default {
  components: { Rarity },
  name: "ItemDetailsModal",

  props: ["item", "dialog"],

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
.item-card {
  width: 400px;
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