<template>
  <v-dialog v-model="dialog" width="500">
    <v-card style="border-radius: 10px !important">
      <h3 class="mb-6 ml-4 mt-4">Online players:</h3>
      <div style="padding: 0px 16px 16px 16px">
        <div class="d-flex players-container">
          <div
            class="d-flex align-center avatar-card flex-column"
            v-for="user in onlineUsers"
            :key="user.props.id"
            @click="selectedUser = user"
          >
            <v-tooltip text="Click to select a player" location="bottom">
              <template v-slot:activator="{ props }">
                <div
                  class="avatar-game"
                  :style="{
                    'background-image': 'url(' + user.props.avatarUrl + ')',
                    'border': isSelected(user) ? '2px solid black': '',
                  }"
                  v-bind="props"
                ></div>
                <b
                  class="mt-1"
                  :style="{
                    color: isSelected(user) ? '#daa520' : 'black',
                  }"
                  >{{ user.props.name }}</b
                >
              </template>
            </v-tooltip>
          </div>
        </div>

        <v-divider class="mt-8 mb-4"></v-divider>

        <div class="d-flex challenge-now align-center" v-if="!loading">
          <gh-input
            v-model="amount"
            :placeholder="'bet value'"
            :type="'number'"
          />
          <v-btn @click="bet" class="btn-bet-now">challenge</v-btn>
        </div>

        <div v-else class="d-flex justify-space-evenly align-center">
          <span><b>Waiting {{ selectedUser.props.name }} accept your challenge</b></span>
          <v-progress-circular indeterminate></v-progress-circular>
        </div>
      </div>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";
import { fetchOnlineUsers } from "../api/user";
import GhInput from "./shared/GhInput.vue";

export default {
  components: { GhInput },
  name: "ChoosePlayersModal",

  props: ["dialog"],

  data: () => ({
    onlineUsers: [],
    amount: null,
    selectedUser: { props: { name: "" } },
    loading: false,
  }),

  computed: {
    ...mapGetters(["user"]),
  },

  methods: {
    ...mapMutations(["setSnackbar"]),

    bet() {
      if (!this.amount || this.amount < 0) {
        return this.setSnackbar({
          open: true,
          text: "Amount must be greather than 0",
        });
      }

      if (Number(this.amount) > Number(this.user.wallet.props.balance)) {
        return this.setSnackbar({
          open: true,
          text: "You do not have enough coins",
        });
      }

      if (!this.selectedUser.props.socketId) {
        return this.setSnackbar({ open: true, text: "Select an opponent" });
      }

      this.$socket.emit("ask_bet", {
        game: "HEADS_OR_TAILS",
        amount: this.amount,
        challengedId: this.selectedUser.props.socketId,
        challengerName: this.user.name,
      });

      this.loading = true;
    },
    isSelected(user) {
      return user.props.id == this.selectedUser.props.id;
    },
  },

  watch: {
    dialog: {
      handler(v) {
        if (!v) {
          this.$emit("onclose");
          if (!this.loading) {
            this.amount = null;
            this.selectedUser = { props: { name: "" } };
          }
        } else {
          fetchOnlineUsers().then((users) => (this.onlineUsers = users));
        }
      },
    },
  },
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Poppins&display=swap");

* {
  font-family: "Poppins" !important;
}

.card-players {
  border-radius: 80px;
}

.players-container {
  gap: 16px;
}

.avatar-card {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  cursor: pointer;
}

.avatar-game {
  background-size: cover;
  background-repeat: no-repeat;
  width: 100px;
  height: 100px;
  border-radius: 50%;
}

.btn-bet-now {
  background-color: rgb(32, 129, 226);
  color: white;
}

.challenge-now {
  gap: 16px;
}
</style>