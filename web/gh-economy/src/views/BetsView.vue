<template>
  <div class="d-flex justify-center align-center bet-container flex-column">
    <span><b>You can challenge other players to a bet.</b></span>
    <v-btn @click="startGame()" class="btn-gh">START GAME</v-btn>
    <choose-players-modal :dialog="dialog" @onclose="dialog = !dialog"/>
  </div>
</template>

<script>
import ChoosePlayersModal from "../components/ChoosePlayersModal.vue";
export default {
  components: { ChoosePlayersModal },

  data: () => ({
    dialog: null,
  }),

  methods: {
    startGame() {
      this.dialog = true;
    },
  },
};
</script>


<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Poppins&display=swap");

* {
  font-family: "Poppins" !important;
}

.bet-container {
  height: 100%;
  gap: 24px;
}


.btn-gh {
  background-color: rgb(32, 129, 226);
  color: white;
}


</style>