<template>
  <div class="d-flex flex-column align-center mt-16">
    <div class="d-flex justify-space-around" style="width: 100%">
      <v-card outlined shaped class="balance-card pa-3 common-card">
        <span class="ml-2 common-title">Balance</span>
        <h2 class="text-center mt-3 d-flex align-center justify-center mr-10">
          <img width="48" src="../assets/coin.png" />
          <span class="ml-4 mt-1">{{ wallet.balance.toFixed(2) }}</span>
        </h2>
      </v-card>

      <v-card
        elevation="2"
        outlined
        shaped
        class="balance-card common-card pa-3"
      >
        <v-tooltip text="Your balance plus sum of all your yields times seven" location="bottom">
          <template v-slot:activator="{ props }">
            <div v-bind="props">
              <span class="ml-2 common-title">Patrimony</span>
              <h2
                class="
                  text-center
                  mt-3
                  d-flex
                  align-center
                  justify-center
                  mr-10
                "
              >
                <img width="48" src="../assets/yield.png" />
                <span class="ml-4 mt-1">{{ user.patrimony.toFixed(2) }}</span>
              </h2>
            </div>
          </template>
        </v-tooltip>
      </v-card>
    </div>

    <v-card elevation="2" outlined shaped class="graph common-card mt-8 pa-3">
      <span class="common-title ml-2">Profitability</span>

      <div class="d-flex justify-center align-center" style="height: 100%">
        <h2 class="text-center">Coming soon</h2>
      </div>
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
@import url("https://fonts.googleapis.com/css2?family=Poppins&display=swap");

* {
  font-family: "Poppins" !important;
}

.balance-card {
  width: 30%;
  height: 130px;
}

.graph {
  height: 600px;
  width: 80%;
}

.common-card {
  box-shadow: rgb(0 0 0 / 8%) 0px 4px 15px !important;
  border-radius: 10px !important;
}

.common-title {
  color: rgb(53, 56, 64) !important;
  font-weight: normal;
}
</style>