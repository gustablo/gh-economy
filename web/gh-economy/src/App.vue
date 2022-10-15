<template>
  <v-app>
    <nav>
      <nav class="d-flex align-center nav" dense dark>
        <v-toolbar-title class="nav-title">
          <div class="d-flex align-center super-title ml-4">
            <img width="50" src="./assets/coin.png" />
            <router-link to="/" class="ml-4">GH Economy</router-link>
          </div>
        </v-toolbar-title>

        <div class="d-flex links align-center">
          <div class="wallet-top d-flex align-center" v-if="loggedIn">
            <img width="28" src="./assets/coin.png" />
            <span class="ml-2">{{ wallet }}</span>
          </div>

          <span v-if="loggedIn">
            <v-tooltip text="Coming soon" location="bottom">
              <template v-slot:activator="{ props }">
                <a v-bind="props">Rankings</a>
              </template>
            </v-tooltip>
          </span>

          <span v-if="loggedIn">
            <router-link to="/bets">Bets</router-link>
          </span>

          <span v-if="loggedIn">
            <v-tooltip text="Shopping" location="bottom">
              <template v-slot:activator="{ props }">
                <router-link to="/store">
                  <v-icon v-bind="props" size="28">mdi-cart-outline</v-icon>
                </router-link>
              </template>
            </v-tooltip>
          </span>

          <span v-if="loggedIn">
            <v-tooltip text="Wallet" location="bottom">
              <template v-slot:activator="{ props }">
                <router-link to="/store">
                  <router-link to="/wallet">
                    <v-icon size="28" v-bind="props">mdi-wallet-outline</v-icon>
                  </router-link>
                </router-link>
              </template>
            </v-tooltip>
          </span>

          <span v-if="loggedIn">
            <v-menu anchor="bottom end" rounded>
              <template v-slot:activator="{ props }">
                <div v-bind="props">
                  <v-tooltip text="My account" location="bottom">
                    <template v-slot:activator="{ props: tooltip }">
                      <v-icon size="28" v-bind="tooltip"
                        >mdi-account-circle-outline</v-icon
                      >
                    </template>
                  </v-tooltip>
                </div>
              </template>
              <v-card>
                <v-card-text>
                  <div class="mx-auto text-center">
                    <v-btn rounded variant="text"
                      ><router-link to="/trades">
                        Negociations
                      </router-link></v-btn
                    >
                    <v-divider class="my-3"></v-divider>
                    <v-btn @click="logout" class="logout">logout</v-btn>
                  </div>
                </v-card-text>
              </v-card>
            </v-menu>
          </span>

          <login-form />
        </div>
      </nav>
    </nav>

    <v-main>
      <router-view />
      <receive-challenge
        :dialog="receiveChallengeModal"
        :bet="receiveChallengeBet"
        @onclose="receiveChallengeModal = false"
      />
      <snackbar />
    </v-main>
  </v-app>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";
import LoginForm from "./components/LoginForm.vue";
import ReceiveChallenge from "./components/ReceiveChallenge.vue";
import Snackbar from "./components/shared/Snackbar.vue";
import { coin } from "./constants/coin";

export default {
  components: {
    LoginForm,
    ReceiveChallenge,
    Snackbar,
  },

  sockets: {
    connect: function () {},
    received_bet_challenge: function (data) {
      this.receiveChallengeModal = true;
      this.receiveChallengeBet = data;

      this.setCurrentBet({
        step: 0,
        id: data.betId,
      });
    },
    redirect_to_game: function (betId) {
      this.$router.push({ name: "bet_game", params: { id: betId } });

      this.setCurrentBet({
        id: betId,
        step: 0,
      });
    },
    make_choice: function (challenger) {
      this.setCurrentBet({
        challengerId: challenger,
        isChallenger: false,
        step: 1,
      });
    },
    enemy_making_choice: function () {
      this.setCurrentBet({
        isChallenger: true,
        step: 1,
      });
    },
    start_game: function () {
      this.setCurrentBet({
        step: 2,
      });
    },
    enemy_made_choice: function (choice) {
      this.setCurrentBet({
        enemyChoice: coin[choice],
      });
    },
    game_result: function (result) {
      this.setCurrentBet({
        result: coin[result],
        step: 3,
      });
    },
    you_win: function () {
      this.setCurrentBet({
        win: true,
        step: 4,
      });
    },
    you_lose: function () {
      this.setCurrentBet({
        win: false,
        step: 4,
      });
    },
    update_wallet: function (newBalance) {
      this.user.wallet.props.balance = newBalance;
      this.setUser(this.user);
    },
  },

  data() {
    return {
      receiveChallengeModal: null,
      receiveChallengeBet: {},
    };
  },

  watch: {
    user: {
      handler(v) {
        if (v && v.id) {
          this.$socket.emit("user_connected", v.id);
        }
      },
    },
  },

  methods: {
    ...mapMutations(["setUser", "setLoggedIn", "setCurrentBet"]),
    logout() {
      this.setUser({});
      localStorage.removeItem("token");
      this.setLoggedIn(false);
      this.$socket.disconnect();
      window.location.reload();
    },
  },
  computed: {
    ...mapGetters(["loggedIn", "user"]),
    wallet() {
      if (this.user.wallet) {
        return this.user.wallet.props.balance.toFixed(2);
      }
    },
  },
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Poppins&display=swap");

* {
  font-family: "Poppins" !important;
}

.nav-title {
  margin-left: 48px;
}

.links {
  gap: 40px;
  margin-right: 40px;
}

.super-title {
  cursor: pointer;
}

.super-title a {
  font-size: 18px;
}

.wallet-top {
  border-radius: 12px;
  border-top-left-radius: 12px;
  border-top-right-radius: 12px;
  border-bottom-right-radius: 12px;
  border-bottom-left-radius: 12px;
  color: black;
  padding: 6px 20px 2px 20px;
}

a {
  text-decoration: none;
  font-size: 16px;
  color: black;
  font-family: "Poppins" !important;
  font-weight: bold;
}

.nav i {
  font-weight: bold !important;
}

.nav {
  height: 100px;
  height: 72px;
  box-shadow: rgb(229 232 235) 0px 1px 0px 0px;
}
</style>