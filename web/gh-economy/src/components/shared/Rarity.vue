<template>
  <small><span :style="{ color: selectColor() }">{{ showRarity() }}</span></small>
</template>

<script>
export default {
    props: ['item'],

    methods: {
      selectColor() {
        switch(this.item.rarity) {
          case 'LOW':
            return '#AADAF0';
          case 'MEDIUM':
            return '#5FBBE7';
          case 'HIGH':
            return '#61377A';
          case 'LEGENDARY':
            return '#594192';
        }
      },
      showRarity() {
        if (this.item.rarity === 'LEGENDARY') {
          return this.item.rarity;
        }

        return this.item.rarity.toLowerCase();
      }
    }
}
</script>

<style>
@import url("https://fonts.googleapis.com/css2?family=Poppins&display=swap");

* {
  font-family: "Poppins" !important;
}

</style>
