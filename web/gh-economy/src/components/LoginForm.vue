<template>
  <div>
    <form v-if="!loggedIn" class="d-flex justify-center align-center login-form" @keypress.enter="authenticate">
      <gh-input placeholder="name" v-model="form.name"> </gh-input>
      <gh-input outlined placeholder="password" type="password" v-model="form.password"> </gh-input>
      <v-btn type="button" @click="authenticate" class="btn-login">
        <span v-if="!loading">LogIn</span>
         <v-progress-circular
          size="24"
          width="3"
          v-else
          indeterminate
        ></v-progress-circular>
      </v-btn>
    </form>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";
import { sigin } from "../api/auth";
import GhInput from './shared/GhInput.vue';

export default {
  components: { GhInput },
  name: "LoginForm",

  data() {
    return {
      loading: false,
      form: {
        name: "",
        password: "",
      },
    };
  },

  computed: {
    ...mapGetters(["loggedIn"]),
  },

  methods: {
    ...mapMutations(["setLoggedIn"]),
    authenticate() {
      this.loading = true;

      sigin(this.form.name, this.form.password).then((result) => {
        localStorage.setItem("token", result.token);
        this.setLoggedIn(true);
        this.form = {};
        window.location.href = '/';
      }).finally(() => this.loading = true);
    },
  },
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Poppins&display=swap");

* {
  font-family: "Poppins" !important;
}

  .login-form {
    width: 500px;
    color: white;
    gap: 20px;
  }

</style>