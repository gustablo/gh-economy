<template>
  <v-app>
    <nav class="d-flex align-center nav" dense dark>
      <v-toolbar-title class="nav-title">
        <div class="d-flex align-center super-title ml-4">
          <div id="logo-container" @click="$router.push({ name: 'home' })">
            <img width="42" src="./assets/heads.png" class="logo-a" />
            <img width="42" src="./assets/tails.png" class="logo-b" />
          </div>
          <router-link to="/" class="ml-4">GH Economy</router-link>
        </div>
      </v-toolbar-title>

      <div class="d-flex links align-center">
        <v-tooltip text="Your balance" location="bottom">
          <template v-slot:activator="{ props }">
            <div
              v-bind="props"
              class="wallet-top d-flex align-center"
              v-if="loggedIn"
            >
              <img width="28" src="./assets/coin.png" />
              <span class="ml-2 mt-1">{{ wallet }}</span>
            </div>
          </template>
        </v-tooltip>

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
          <v-tooltip text="Store" location="bottom">
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
          <v-menu rounded :close-on-content-click="false">
            <template v-slot:activator="{ props }">
              <div v-bind="props">
                <v-tooltip text="My account" location="bottom">
                  <template v-slot:activator="{ props: tooltip }">
                    <v-icon style="cursor: pointer" size="28" v-bind="tooltip"
                      >mdi-account-circle-outline</v-icon
                    >
                  </template>
                </v-tooltip>
              </div>
            </template>
            <v-card>
              <v-list>
                <v-list-item>
                  <div>
                    <img
                      width="100"
                      style="border-radius: 50%"
                      :src="user.avatarUrl"
                      class="ml-3 mb-3 mt-2"
                    />
                  </div>

                  <div>
                    <v-list-item-title>{{ user.name }}</v-list-item-title>
                    <v-list-item-subtitle
                      >Sir Lord of Coins</v-list-item-subtitle
                    >
                  </div>
                </v-list-item>
              </v-list>

              <v-divider></v-divider>

              <v-list>
                <v-list-item
                  @click="$router.push({ name: 'my announcements' })"
                >
                  <v-list-item-title> My announcements </v-list-item-title>
                </v-list-item>

                <v-list-item @click="logout">
                  <v-list-item-title>Logout</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-card>
          </v-menu>
        </span>

        <login-form />
      </div>
    </nav>

    <div class="d-flex flex-column align-center justify-center mt-8" v-if="currentRoute !== 'Home'">
      <h1>{{ currentRoute }}</h1>
    </div>

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

      this.playAudio("/received.mpeg");
    },
    redirect_to_game: function (betId) {
      this.$router.push({ name: "game", params: { id: betId } });

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
    you_win: function (amountWon) {
      this.setCurrentBet({
        win: true,
        step: 4,
        amountWon,
      });

      this.playAudio("/win.mpeg");
    },
    you_lose: function (amountLost) {
      this.setCurrentBet({
        win: false,
        step: 4,
        amountLost,
      });

      this.playAudio("/lose.mpeg");
    },
    update_wallet: function (newBalance) {
      this.user.wallet.props.balance = newBalance;
      this.setUser(this.user);

      this.setSnackbar({
        color: "success",
        text: "Wallet updated",
        open: true,
      });
    },
    denied_game: function () {
      this.emitter.emit("CLOSE_CHOOSE_MODAL");
      this.setSnackbar({ color: "error", text: "Bet denied", open: true });
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
    ...mapMutations(["setUser", "setLoggedIn", "setCurrentBet", "setSnackbar"]),
    playAudio(src) {
      const audio = new Audio(src);

      audio.crossOrigin = "anonymous";

      audio.play().then();
    },
    logout() {
      this.setUser({});
      localStorage.removeItem("token");
      this.setLoggedIn(false);
      this.$socket.disconnect();
      window.location.reload();
    },
  },
  
  computed: {
    ...mapGetters(["loggedIn", "user", 'route']),
    currentRoute() {
      if (!this.route) return '';

      return this.route.charAt(0).toUpperCase()
        .concat(this.route.substr(1, this.route.length));
    },
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

#logo-container {
  width: 42px;
  height: 42px;
  transition-delay: 5s;
  cursor: pointer;
}

.super-title:hover > #logo-container {
  transition: -webkit-transform 1s ease-in;
  -webkit-transform-style: preserve-3d;
  -webkit-animation: flipLogo 5s infinite ease-out forwards;
  -moz-animation: flipLogo 5s infinite ease-out forwards;
  -o-animation: flipLogo 5s infinite ease-out forwards;
  animation: flipLogo 5s infinite ease-out forwards;
  transition-delay: 5s;
}

#logo-container img {
  position: absolute;
  -webkit-backface-visibility: hidden;
}

.logo-a {
  z-index: 100;
}

.logo-b {
  -webkit-transform: rotateY(-180deg);
}

@-webkit-keyframes flipLogo {
  from {
    -webkit-transform: rotateY(0);
    -moz-transform: rotateY(0);
    transform: rotateY(0);
  }
  to {
    -webkit-transform: rotateY(1080deg);
    -moz-transform: rotateY(1080deg);
    transform: rotateY(1080deg);
  }
}

.nav-title {
  margin-left: 48px;
}

.links {
  gap: 40px;
  margin-right: 40px;
}

.super-title a {
  font-size: 18px;
}

.wallet-top {
  color: black;
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