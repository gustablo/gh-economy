<template>
    <div class="d-flex wallet-cards mt-12 ml-12">
        <v-card v-for="item in items" :key="item.id">
            <div style="width: 300px; height: 350px; position: relative">
                <img :src="item.imageUrl" class="wallet-img"/>
            </div>

            <v-card-actions class="d-flex flex-column">
                <b>{{ item.name }}</b>
                <span>Quantity: {{ item.quantity }}</span>
                <v-btn style="width: 100%" class="mt-4" @click="openSellModal(item)">Sell</v-btn>
            </v-card-actions>
        </v-card>
        <sell-modal :dialog="dialog" :item="selectedItem" @onclose="dialog = !dialog" />
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { myItems } from '../api/item';
import SellModal from '../components/SellModal.vue';

export default {
    components: {
        SellModal
    },
    data() {
        return {
            dialog: false,
            selectedItem: {},
            userItems: [],
        }
    },

    mounted() {
        this.fetchMyItems();
    },

    computed: {
        ...mapGetters(['user']),

        items() {
            return this.userItems.map(({ props }) => {
                const item = props.item.props;

                return {
                    ...item,
                    quantity: props.quantity,
                }
            });
        }
    },

    methods: {
        fetchMyItems() {
            myItems(this.user.id)
                .then(result => (this.userItems = result))
        },
        openSellModal(item) {
            this.selectedItem = item;
            this.dialog = true;
        }
    }
}
</script>

<style scoped>
    .wallet-cards {
        gap: 60px;
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