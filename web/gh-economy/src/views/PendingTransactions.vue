<template>
    <div class="d-flex flex-column align-center justify-center mt-12 pending-cards">
        <v-card v-for="transaction in transactions" :key="transaction.id" style="width: 50%; height: 80px" class="d-flex align-center justify-space-between">
                <v-card-title class="ml-4">
                    <span>{{ transaction.fromUser.props.name }} wants to buy {{ transaction.quantityItemsAsked }} of your {{ transaction.announcement.props.item.props.name }}</span>
                </v-card-title>
                
            <v-card-actions class="d-flex justify-center align-center mt-2">
                <div>
                    <v-btn @click="cancel(transaction.id)">DENY</v-btn>
                    <v-btn @click="confirm(transaction.id)">ACCEPT</v-btn>
                </div>
            </v-card-actions>
        </v-card>
    </div>
</template>

<script>
import { confirm, pendingTrades } from '../api/trade'
export default {
    data() {
        return {
            transactions: [],
        }
    },

    mounted() {
        this.fetchPendingTrades();
    },

    methods: {
        fetchPendingTrades() {
            pendingTrades()
                .then(result => (this.transactions = result))
        },
        confirm(id) {
            confirm(id, 'ACCEPT')
                .then(() => {
                    this.fetchPendingTrades();
                    alert('operation successfully');
                })
        },
        cancel(id) {
            confirm(id, 'DECLINE')
                .then(() => {
                    this.fetchPendingTrades()
                    alert('operation canceled')
                })
        },
    },
}
</script>

<style scoped>
    .pending-cards {
        gap: 60px;
    }
</style>