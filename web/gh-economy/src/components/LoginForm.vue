<template>
  <div>
    <form v-if="!loggedIn" class="d-flex justify-center align-center login-form">
      <gh-input placeholder="name" v-model="form.name"> </gh-input>
      <gh-input outlined placeholder="password" type="password" v-model="form.password"> </gh-input>
      <v-btn type="button" @click="authenticate" class="btn-login">LogIn</v-btn>
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
      sigin(this.form.name, this.form.password).then((result) => {
        localStorage.setItem("token", result.token);
        this.setLoggedIn(true);
        this.form = {};
        window.location.href = '/';
      });
    },
  },
};
</script>

<style scoped>
  .login-form {
    width: 500px;
    color: white;
    gap: 20px;
  }

</style>