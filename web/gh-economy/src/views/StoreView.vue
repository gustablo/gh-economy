<template>
    <div class="d-flex flex-wrap store-cards mt-12 ml-12 justify-center mb-12">
        <item-card v-for="item in items" :key="item.id" :item="item"/>
    </div>
</template>

<script>
import { getItems } from '../api/item';
import ItemCard from '../components/ItemCard.vue';

export default {
  components: { ItemCard },

    data() {
        return {
            items: [],
        }
    },
    methods: {
        fetchItems() {
            getItems()
                .then(items => (this.items = items))      
        }
    },
    mounted() {
        this.fetchItems();
    }
}
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
