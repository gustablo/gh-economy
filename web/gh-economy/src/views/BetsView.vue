<template>
  <div>
    <v-tabs v-model="tab" background-color="primary">
      <v-tab value="roulette">Roulette</v-tab>
      <v-tab value="crash">Crash</v-tab>
    </v-tabs>
    <v-window v-model="tab">
      <v-window-item value="roulette">
        <roulette />
      </v-window-item>

      <v-window-item value="crash">
        <crash/>
      </v-window-item>
    </v-window>
  </div>
</template>

<script>
import Crash from '../components/Bets/Crash.vue';
import Roulette from "../components/Bets/Roulette.vue";

export default {
  components: {
    Roulette,
    Crash,
  },

  data: () => ({
    tab: null,
  }),
};
</script>


<style scoped>
</style>