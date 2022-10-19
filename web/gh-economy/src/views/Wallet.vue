<template>
  <div
    class="d-flex flex-wrap wallet-cards mt-12 ml-12 justify-center mb-16"
    v-if="!fetching && userItems.length"
  >
    <v-card
      v-for="(item, i) in items"
      :key="item.id"
      class="wallet-card d-flex flex-column align-center"
    >
      <div class="img-card-wallet inline-block">

      <div
        class="img-card-wallet block"
        :style="{ 'background-image': 'url(' + item.imageUrl + ')' }"
      ></div>
      </div>

      <v-card-actions
        class="d-flex flex-column wallet-actions-card align-start"
      >
        <b>{{ item.name }}</b>

        <div class="d-flex">
          <div class="d-flex flex-column">
            <span
              style="font-size: 13px; color: rgb(53, 56, 64) !important"
              class="mr-2 mt-4"
              >buyed per</span
            >

            <div class="d-flex align-center mb-8">
              <img width="28" src="../assets/coin.png" />
              <span class="ml-1 mt-1">{{ item.buyedPer }}</span>
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

        <rarity :item="item" />

        <v-btn
          style="width: 100%;"
          class="mt-4 btn-sell"
          @click="openSellModal(item)"
          v-if="!item.announcementId"
          >sell</v-btn
        >
        <v-btn
          style="width: 100%; background-color: #F44336 !important"
          class="mt-4 btn-sell"
          @click="() => cancelAnnouncement(item, i)"
          v-else
          >
          <v-progress-circular size="24" width="3" v-if="loading == i" indeterminate></v-progress-circular>
          <span v-else>cancel announcement</span>
          </v-btn
        >
      </v-card-actions>
    </v-card>
    <sell-modal
      :dialog="dialog"
      :item="selectedItem"
      @onclose="dialog = false; loading = -1"
      @onsell="fetchMyItems()"
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
    v-else-if="!userItems.length"
    style="height: 100%"
    class="d-flex align-center justify-center"
  >
    <span>Nothing here, you can buy items in the shopping</span>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";
import { cancelAnnouncement } from '../api/announcement';
import { myItems } from "../api/item";
import SellModal from "../components/SellModal.vue";
import Rarity from "../components/shared/Rarity.vue";

export default {
  components: {
    SellModal,
    Rarity,
  },
  data() {
    return {
      dialog: false,
      selectedItem: {},
      userItems: [],
      fetching: true,
      loading: -1,
    };
  },

  mounted() {
    this.fetchMyItems();
  },

  computed: {
    ...mapGetters(["user"]),

    items() {
      return this.userItems.map((userItem) => {
        const item = userItem.item.props;

        return {
          ...item,
          ...userItem,
        };
      });
    },
  },

  methods: {
    ...mapMutations(['setSnackbar']),
    fetchMyItems() {
      myItems(this.user.id)
        .then((result) => (this.userItems = result))
        .finally(() => (this.fetching = false));
    },
    openSellModal(item) {
      this.selectedItem = item;
      this.dialog = true;
    },
    cancelAnnouncement(item, i) {
      this.loading = i;
  
      cancelAnnouncement(item.announcementId)
        .then(() => {
          this.fetchMyItems();
          this.setSnackbar({ open: true, color: 'success', text: 'Announcement canceled successfully' });
        })
        .finally(() => (this.loading = -1))
    }
  },
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Poppins&display=swap");

* {
  font-family: "Poppins" !important;
  font-weight: bold;
}

.wallet-cards {
  gap: 60px;
}

.wallet-card {
  width: 350px;
  box-shadow: rgb(0 0 0 / 8%) 0px 4px 15px;
  position: relative;
  border-radius: 10px;
}

.inline-block {
  display: inline-block;
  overflow: hidden;
}

.block {
  display: block;
  transition: transform .4s;
}

.wallet-card:hover .block {
  transform: scale(1.15);
  transform-origin: 50% 50%;
}

.img-card-wallet {
  width: 100%;
  height: 400px;
  position: relative;
  background-size: cover;
  background-repeat: no-repeat;
}

.wallet-actions-card {
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
  border-radius: 0;
}

.wallet-card:hover .btn-sell {
  transform: translateY(0);
}

.wallet-img {
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