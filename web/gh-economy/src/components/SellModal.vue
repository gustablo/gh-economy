<template>
  <v-dialog v-model="dialog" width="500">
    <v-card>
      <img :src="item.imageUrl" />

      <v-card-actions class="d-flex flex-column sell-actions">
        <h2 class="mb-8">{{ item.name }}</h2>

        <div class="d-flex">
          <v-text-field type="number" v-model="valuePerItem" label="Sell each per GH$"></v-text-field>
        </div>
        <div class="d-flex align-center negocation-value">
          <v-btn @click="quantity--" class="mb-4">-</v-btn>
          <v-text-field
            type="number"
            v-model="quantity"
            :max="item.quantity"
            min="0"
            label="Quantity"
            style="width: 235px"
          ></v-text-field>
          <v-btn @click="quantity++" class="mb-4">+</v-btn>
        </div>
        <v-btn style="width: 100%" @click="sell" class="mt-6">sell</v-btn>

      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import {  createAnnouncement} from '../api/announcement';

export default {
  name: "SellModal",

  props: ["dialog", "item"],

  data() {
    return {
      quantity: 0,
      valuePerItem: 0
    };
  },

  methods: {
    sell() {
        createAnnouncement(this.item.id, this.quantity, this.valuePerItem)
            .then(() => alert('sales order created'))
    }
  },

  watch: {
    dialog: {
      handler(v) {
        if (!v) {
          this.$emit("onclose");
        }
      },
    },
    quantity: {
      handler(value, old) {
        if (value >= 0 && value <= this.item.quantity) {
          this.quantity = value;
        } else {
          this.quantity = old;
        }
      },
    },
  },
};
</script>

<style>
  .negocation-value {
    gap: 16px;
  }
</style>