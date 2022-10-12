<template>
  <div>
    <form v-if="!loggedIn" class="d-flex justify-center align-center login-form">
      <v-text-field outlined label="name" type="text" v-model="form.name"> </v-text-field>
      <v-text-field outlined label="password" type="password" v-model="form.password"> </v-text-field>
      <v-btn type="button" @click="authenticate" class="btn-login">LogIn</v-btn>
    </form>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";
import { sigin } from "../api/auth";

export default {
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

    margin-top: 20px;
  }

  .login-form > .btn-login {
    margin-top: -20px;
  }

</style>