<template>
  <v-app>
    <nav>
      <nav class="d-flex align-center nav" dense dark>
        <v-toolbar-title class="nav-title"
          ><router-link to="/">GH Economy</router-link></v-toolbar-title
        >

        <v-spacer></v-spacer>

        <div class="d-flex links">
          <div style="border: 1px solid white; color: white; padding: 6px 20px 2px 20px" v-if="loggedIn">
            GH$ {{ wallet }}
          </div>

          <span v-if="loggedIn">
            <router-link to="/">Bank loan</router-link>
          </span>

          <span v-if="loggedIn">
            <router-link to="/bets">Bets</router-link>
          </span>

          <span v-if="loggedIn">
            <router-link to="/store">Store</router-link>
          </span>

          <span v-if="loggedIn">
            <router-link to="/trades">Negociations</router-link>
          </span>

          <span v-if="loggedIn">
            <router-link to="/wallet">Wallet</router-link>
          </span>

          <login-form />
        </div>
      </nav>
    </nav>

    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";
import LoginForm from "./components/LoginForm.vue";
export default {
  components: { LoginForm },
  name: "App",

  methods: {
    ...mapMutations(["setUser"]),
  },
  computed: {
    ...mapGetters(["loggedIn", "user"]),
    wallet() {
      if (this.user.wallet) {
        return this.user.wallet.props.balance.toFixed(2);
      }
    }
  },
};
</script>

<style scoped>
  .nav-title {
    margin-left: 20px;
  }

  .links {
    gap: 30px;
    margin-right: 40px;
  }

  a {
    text-decoration: none;
    font-size: 20px;
    color: white;
  }

  .nav {
    height: 100px;
    background: #6A76AB;
  }

</style>