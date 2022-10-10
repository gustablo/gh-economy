<template>
    <v-card class="item-card">
        <div>
            <img :src="item.imageUrl" width="300"/>
        </div>

        <v-card-actions class="d-flex flex-column">
            <span>{{ item.name }}</span>
            <v-btn style="width: 100%" class="mt-4" @click="openBuyItemModal(item)" v-if="loggedIn">buy</v-btn>
        </v-card-actions>

        <buy-item-modal :dialog="dialog" :item="selectedItem" @onclose="dialog = !dialog"/>
    </v-card>
</template>

<script>
import { mapGetters } from 'vuex';
import BuyItemModal from './BuyItemModal.vue'
export default {
  components: { BuyItemModal },
    name: 'ItemCard',

    props: ['item'],

    computed: {
        ...mapGetters(['loggedIn'])
    },

    data() {
        return {
            dialog: false,
            selectedItem: {},
        }
    },

    methods: {
        openBuyItemModal(item) {
            this.selectedItem = item;
            this.dialog = true;
        },
    }
}
</script>

<style scoped>
    .item-card:hover {
        cursor: pointer;
    }

</style>