<template>
  <div
    v-if="!fetching && transactions.length"
    class="d-flex flex-column align-center justify-center mt-12 pending-cards mb-8"
  >
    <v-card
      v-for="transaction in transactions"
      :key="transaction.id"
      style="
        width: 50%;
        box-shadow: rgb(0 0 0 / 8%) 0px 4px 15px !important;
        border-radius: 10px !important;
      "
      class="pa-4"
    >
      <v-tooltip text="Click to open more details" location="bottom">
        <template v-slot:activator="{ props }">
          <b
            v-bind="props"
            class="item-your-pending"
            @click="openMoreDetails(transaction)"
            >{{ transaction.announcement.props.item.props.name }}</b
          >
        </template>
      </v-tooltip>

      <div class="mt-2 d-flex ml-1 justify-space-between">
        <div class="d-flex">
          <div class="d-flex flex-column">
            <span class="subtitle-pending mr-2 mt-4">buyer</span>

            <div class="d-flex align-center mt-1">
              <b class="ml-1 mt-1">{{ transaction.fromUser.props.name }}</b>
            </div>
          </div>

          <div class="d-flex flex-column mt-4 ml-6">
            <span class="subtitle-pending">proposal</span>

            <div class="d-flex align-center mt-1">
              <img width="28" src="../assets/coin.png" />
              <span class="ml-1">{{ transaction.amount }}</span>
            </div>
          </div>
        </div>

        <div class="d-flex btns-pending align-self-end mr-1">
          <v-btn
            color="red darken-4"
            @click="answerNegociation(transaction, 'DECLINE')"
          >
            <span>DENY</span></v-btn
          >
          <v-btn
            color="teal darken-1"
            @click="answerNegociation(transaction, 'ACCEPT')"
          >
            <span>ACCEPT</span>
          </v-btn>
        </div>
      </div>

      <v-progress-linear
        v-if="transaction.loading"
        class="mt-4"
        indeterminate
      ></v-progress-linear>
    </v-card>

    <item-details-modal
      :item="selectedItem"
      :announcement="selectedAnnouncement"
      :dialog="dialog"
      @onclose="dialog = false"
    />
  </div>

  <div
    v-else-if="fetching"
    style="height: 100%"
    class="d-flex align-center justify-center"
  >
    <v-progress-circular
      width="6"
      size="100"
      indeterminate
    ></v-progress-circular>
  </div>

  <div
    v-else-if="!transactions.length"
    style="height: 100%"
    class="d-flex align-center justify-center"
  >
    <b>Nothing here, you can announce items accessing your wallet</b>
  </div>
</template>

<script>
import { mapMutations } from "vuex";
import { confirm, pendingTrades } from "../api/trade";
import ItemDetailsModal from "../components/ItemDetailsModal.vue";
export default {
  components: { ItemDetailsModal },
  data() {
    return {
      transactions: [],
      selectedItem: {},
      dialog: null,
      fetching: true,
    };
  },

  mounted() {
    this.fetchPendingTrades();
  },

  methods: {
    ...mapMutations(["setSnackbar"]),
    fetchPendingTrades() {
      pendingTrades()
        .then((result) => (this.transactions = result))
        .finally(() => (this.fetching = false));
    },
    openMoreDetails(transaction) {
      this.selectedItem = transaction.announcement.props.item.props;
      this.selectedAnnouncement = transaction.announcement.props;
      this.dialog = true;
    },
    answerNegociation(transaction, option) {
      if (transaction.loading) return;

      const snackbarMessages = {
        ACCEPT: "item sold successfully",
        DECLINE: "negociation declined",
      };

      transaction.loading = true;

      confirm(transaction.id, option).then(() => {
        this.fetchPendingTrades();
        this.setSnackbar({
          open: true,
          color: "success",
          text: snackbarMessages[option],
        });

        transaction.loading = false;
      });
    },
  },
};
</script>

<style scoped>
.pending-cards {
  gap: 48px;
}

.h-full {
  height: 100%;
}

.btns-pending {
  gap: 16px;
}

.item-your-pending {
  font-style: italic;
  cursor: pointer;
  font-size: 24px;
}

.subtitle-pending {
  font-size: 13px;
  color: rgb(53, 56, 64) !important;
}
</style>
