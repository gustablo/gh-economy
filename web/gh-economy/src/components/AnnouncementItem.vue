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
      </div>
    </div>

    <v-divider style="width: 100%; margin-left: -7px" class="mb-4"></v-divider>

    <div class="d-flex buy-inputs align-center">
      <gh-input :placeholder="'proposal'" v-model="proposal" :type="'number'" />

      <v-btn class="btn-buy" @click="buy">
        <span v-if="!loading">send</span>
        <v-progress-circular
          size="24"
          width="3"
          v-else
          indeterminate
        ></v-progress-circular>
      </v-btn>
    </div>
  </div>
</template>

<script>
import { mapMutations } from "vuex";
import { ask } from "../api/trade";
import GhInput from "./shared/GhInput.vue";

export default {
  components: { GhInput },
  name: "AnnouncementItem",

  props: ["announcement", "item"],

  data() {
    return {
      quantity: 1,
      proposal: null,
      loading: false,
    };
  },

  methods: {
    ...mapMutations(["setSnackbar"]),
    buy() {
      if (this.loading) return;

      this.loading = true;

      ask(this.announcement.id, this.quantity, this.proposal).then(() => {
        this.setSnackbar({
          open: true,
          color: "success",
          text: "proposal successfully, wait user accept",
        });

        this.emitter.emit("ITEM_PROPOSAL_MADE");
      }).finally(() => this.loading = false)
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
  background-color: rgb(32, 129, 226);
  color: white;
  height: 44px !important;
  width: 25% !important;
}

.buy-inputs {
  gap: 32px;
  margin-left: -16px;
}
</style>