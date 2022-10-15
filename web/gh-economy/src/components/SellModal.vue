<template>
  <v-dialog v-model="dialog" width="500">
    <v-card class="sell-card" style="border-radius: 10px !important">
      <div
        class="sell-image"
        :style="{ 'background-image': 'url(' + item.imageUrl + ')' }"
      ></div>

      <v-card-actions class="sell-actions mb-6 d-flex justify-center">
        <div class="d-flex flex-column text-center">
          <h2 class="mb-10 mt-4">{{ item.name }}</h2>

          <div class="d-flex sell-inputs align-center">
            <gh-input
              :placeholder="'price'"
              v-model="valuePerItem"
              :type="'number'"
            />

            <v-btn class="sell-modal-btn" @click="sell">sell</v-btn>
          </div>
        </div>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapMutations } from 'vuex';
import { createAnnouncement } from "../api/announcement";
import GhInput from "./shared/GhInput.vue";

export default {
  components: { GhInput },
  name: "SellModal",

  props: ["dialog", "item"],

  data() {
    return {
      quantity: 1,
      valuePerItem: null,
    };
  },

  methods: {
    ...mapMutations(['setSnackbar']),
    sell() {
      createAnnouncement(this.item.id, this.quantity, this.valuePerItem).then(
        () => {
          this.setSnackbar({ open: true, text: 'Item announced successfully', color: 'success' });
          this.$emit('onsell');
        }
      );
    },
  },

  watch: {
    dialog: {
      handler(v) {
        if (!v) {
          this.$emit("onclose");
          this.valuePerItem = null;
        }
      },
    },
  },
};
</script>

<style>
@import url("https://fonts.googleapis.com/css2?family=Poppins&display=swap");

* {
  font-family: "Poppins" !important;
  font-weight: bold;
}

.negocation-value {
  gap: 16px;
}

.sell-card {
  border-radius: 10px;
}

.sell-image {
  height: 500px;
  position: relative;
  background-size: cover;
  background-repeat: no-repeat;
}

.sell-modal-btn {
  background-color: rgb(32, 129, 226);
  color: white;
  height: 44px !important;
  width: 25% !important;
}

.sell-inputs {
  gap: 32px;
}
</style>