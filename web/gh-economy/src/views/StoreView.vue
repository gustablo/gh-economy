<template>
  <div
    class="d-flex flex-wrap store-cards mt-12 ml-12 justify-center mb-12"
    v-if="!fetching && items.length"
  >
    <item-card v-for="item in items" :key="item.id" :item="item" />
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
    v-else-if="!items.length"
    style="height: 100%"
    class="d-flex align-center justify-center"
  >
    <span>Nothing here, nobody announced items</span>
  </div>

</template>

<script>
import { getItems } from "../api/item";
import ItemCard from "../components/ItemCard.vue";

export default {
  components: { ItemCard },

  data() {
    return {
      items: [],
      fetching: true,
    };
  },

  methods: {
    fetchItems() {
      getItems()
        .then((items) => (this.items = items))
        .finally(() => (this.fetching = false));
    },
  },
  mounted() {
    this.fetchItems();
  },
};
</script>


<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Poppins&display=swap");

* {
  font-family: "Poppins" !important;
  font-weight: bold;
}

.store-cards {
  gap: 60px;
}
</style>
