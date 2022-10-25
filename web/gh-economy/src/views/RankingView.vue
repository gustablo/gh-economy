<template>
  <div class="d-flex flex-column pa-16 align-center justify-center">
    <div class="d-flex flex-column" style="width: 60%">
      <h2>More riches</h2>

      <div class="d-flex justify-space-between">
        <div class="d-flex flex-column mt-6" style="gap: 8px">
          <div class="d-flex align-center" style="gap: 8px">
            <img style="width: 48px" src="../assets/medalha-de-ouro.png" />
            <span>1200 coins</span>
          </div>
          <div class="d-flex align-center" style="gap: 8px">
            <img
              style="width: 44px; margin-left: 2px"
              src="../assets/medalha-de-prata.png"
            />
            <span>500 coins</span>
          </div>

          <div class="d-flex align-center" style="gap: 8px">
            <img
              style="width: 42px; margin-left: 4px"
              src="../assets/medalha-de-bronze.png"
            />
            <span>200 coins</span>
          </div>
        </div>

        <div class="d-flex flex-column align-self-center">
          <h2>Ends in:</h2>
          <h1>{{ showHours }}</h1>
        </div>
      </div>
    </div>

    <v-table style="width: 60%" class="mt-8">
      <div class="d-flex justify-center align-center mt-8" v-if="loading">
        <v-progress-circular
          width="6"
          size="100"
          indeterminate
        ></v-progress-circular>

      </div>

      <thead v-else>
        <tr>
          <th class="text-left">Name</th>
          <th class="text-left">Yield</th>
          <th width="200px" class="text-left">Itens count</th>
          <th width="30px" class="text-left">Wallet</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in users" :key="item.name">
          <td style="font-weight: 700">{{ item.name }}</td>
          <td>{{ item.yield }}</td>
          <td>{{ item.itensCount }}</td>
          <td style="font-weight: 700">
            {{ item.wallet.props.balance.toFixed(2) }}
          </td>
        </tr>
      </tbody>
    </v-table>
  </div>
</template>

<script>
import { riches } from "../api/user";
export default {
  data() {
    return {
      loading: true,
      users: [],
      endsAt: new Date("2022-11-28"),
      showHours: null,
    };
  },

  mounted() {
    let interval = setInterval(() => {
      const diff = this.endsAt.getTime() - new Date().getTime();
      const diffAsDate = new Date(diff);

      const hours = this.twoDigits(diffAsDate.getHours());
      const minutes = this.twoDigits(diffAsDate.getMinutes());
      const seconds = this.twoDigits(diffAsDate.getSeconds());

      this.showHours = `${hours}:${minutes}:${seconds}`;
      if ((hours <= 0 && minutes <= 0 && seconds <= 0) || (this.endsAt >= new Date())) {
        clearInterval(interval);
        this.showHours = "Event end";
      }
    }, 1);

    riches().then(
      (result) => (this.users = this.countFields(result.map((r) => r.props)))
    ).finally(() => this.loading = false)
  },

  methods: {
    twoDigits(num) {
      return num.toLocaleString("en-US", {
        minimumIntegerDigits: 2,
        useGrouping: false,
      });
    },
    countFields(users) {
      return users.map((user) => ({
        ...user,
        itensCount: user.userItems.length,
        yield: user.userItems.reduce((acc, cur) => {
          return acc + cur.props.item.props.yield;
        }, 0),
      }));
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
