<template>
  <v-dialog v-model="dialog" width="500">
    <v-card class="buy-modal-card" style="border-radius: 10px !important">
      <div
        class="buy-modal-image"
        :style="{ 'background-image': 'url(' + item.imageUrl + ')' }"
      ></div>

      <v-card-actions class="buy-actions mb-6 d-flex justify-start">
        <div class="d-flex flex-column text-center align-start ml-10">
          <h2 class="mb-6 mt-4">{{ item.name }}</h2>

            <announcement-item
              v-for="announcement in announcements"
              :key="announcement.id"
              :announcement="announcement"
              :item="item"
            />
        </div>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { getItemAnnouncements } from "../api/item";
import AnnouncementItem from "./AnnouncementItem.vue";
export default {
  components: { AnnouncementItem },
  name: "BuyItemModal",
  props: ["dialog", "item"],

  mounted() {
    this.emitter.on('ITEM_PROPOSAL_MADE', () => this.$emit('onclose'));
  },

  computed: {
    announcements() {
      return this.item.announcements;
    },
  },

  methods: {
    fetchItem() {
      getItemAnnouncements(this.item.id).then(
        ({ announcements }) => (this.item.announcements = announcements)
      );
    },
  },

  watch: {
    dialog: {
      handler(v) {
        if (!v) {
          this.$emit("onclose");
        } else {
          this.fetchItem();
        }
      },
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

.buy-modal-card {
  border-radius: 10px;
}

.buy-modal-image {
  height: 500px;
  position: relative;
  background-size: cover;
  background-repeat: no-repeat;
}
</style>