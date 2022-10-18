<template>
  <v-snackbar v-model="snackbar.open" :color="color">
    {{ snackbar.text }}
  </v-snackbar>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";

export default {
  computed: {
    ...mapGetters(["snackbar"]),
    color() {
      if (this.snackbar.color == "error") {
        return "red darken-4";
      }

      return "teal darken-1";
    },
  },

  data: () => ({
    timeout: 2000,
  }),

  methods: {
    ...mapMutations(["setSnackbar"]),
  },

  watch: {
    "snackbar.open": {
      handler(v) {
        if (v) {
          setTimeout(() => {
            this.setSnackbar({ open: false, text: "" });

            setTimeout(() => {
              this.setSnackbar({ color: "error" });
            }, 300);
          }, this.timeout);
        }
      },
    },
  },
};
</script>

<style>
</style>