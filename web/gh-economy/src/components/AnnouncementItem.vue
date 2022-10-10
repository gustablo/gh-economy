<template>
  <v-expansion-panel title="">
    <v-expansion-panel-title>
      <span
        >Sold by <b>{{ announcement.user.props.name }}</b></span
      >
      <span
        >&nbsp per <b>GH${{ announcement.valuePerItem }}</b> each</span
      >
    </v-expansion-panel-title>

    <v-expansion-panel-text>
      <div class="d-flex align-center announcement-gap">
        <v-text-field
          class="mt-5"
          type="number"
          v-model="quantity"
          :max="announcement.quantityAvailable"
          label="Quantity"
          min="0"
        ></v-text-field>

        <v-btn @click="buy">buy</v-btn>
      </div>
    </v-expansion-panel-text>

    <v-divider></v-divider>
  </v-expansion-panel>
</template>

<script>
import { ask } from "../api/trade";

export default {
  name: "AnnouncementItem",

  props: ["announcement"],

  data() {
    return {
      quantity: 0,
    };
  },

  methods: {
    buy() {
      ask(this.announcement.id, this.quantity).then(() =>
        alert("operation successfully")
      );
    },
  },

  watch: {
    quantity: {
      handler(value, old) {
        if (value >= 0 && value <= this.announcement.quantityAvailable) {
          this.quantity = value;
        } else {
          this.quantity = old;
        }
      },
    },
  },
};
</script>

<style scoped>
.announcement-gap {
  gap: 16px;
}
</style>