<template>
  <div class="d-flex flex-column align-center mt-16">
    <div class="d-flex justify-space-around" style="width: 100%">
      <v-card outlined shaped class="balance-card pa-3">
        <span class="ml-3">Balance</span>
        <h2 class="text-center mt-2">GH$ {{ wallet.balance.toFixed(2) }}</h2>
      </v-card>
      <v-card elevation="2" outlined shaped class="balance-card pa-3">
        <span class="ml-3">Patrimony</span>
        <h2 class="text-center mt-2">Coming soon</h2>
      </v-card>
    </div>
    <v-card elevation="2" outlined shaped class="graph mt-8 pa-3">
      <span>Profitability</span>

      <h2 class="text-center">Coming soon</h2>
    </v-card>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "HomeView",

  computed: {
    ...mapGetters(["user"]),

    wallet() {
      return this.user.wallet.props;
    },
  },
};
</script>


<style scoped>
.balance-card {
  width: 30%;
  height: 120px;
}

.graph {
  height: 400px;
  width: 80%;
}
</style>