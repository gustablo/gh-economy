<template>
  <v-dialog v-model="dialog" width="500">
    <v-card>
      <img :src="item.imageUrl" />

      <v-card-actions class="d-flex flex-column" style="padding: 16px 16px 16px 16px">
        <h2 class="mb-8">{{ item.name }}</h2>

        <v-expansion-panels accordion multiple>
          <announcement-item
            v-for="announcement in announcements"
            :key="announcement.id"
            :announcement="announcement"
          />
        </v-expansion-panels>
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
</style>