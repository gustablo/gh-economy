<template>
    <div class="d-flex store-cards mt-12 ml-12">
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
    .store-cards {
        gap: 60px;
    }
</style>
