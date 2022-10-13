<template>
  <div>
    <div @click="startGame()">HEADS OR TAILS</div>
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
</style>