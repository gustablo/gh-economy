<template>
  <div>
  </div>
</template>

<script>
export default {
    data: () => ({
        intialText: 'hhsdahdsahdsahshahdsdhsa',
        showChoice: false,
        challengerId: null,
    }),

    methods: {
        makeChoice(choice) {
            this.$socket.emit('made_choice', {
                choice,
                challengerId: this.challengerId,
            });
            this.showChoice = false;
        }
    },

    sockets: {
        connect: function() {},
        make_choice: function(challenger) {
            console.log('dsalkjdslakjdsalkdsakjdsadaks');
            this.intialText = 'Heads or Tails?';
            this.showChoice = true;
            this.challengerId = challenger;
        },
        enemy_making_choice: function() {
            this.intialText = 'Waiting for enemy make the choice...';
        },
        enemy_made_choice: function(choice) {
            const headsOrTails = choice == 0 ? 'heads' : 'tails';
            this.initialText = `enemy choose ${headsOrTails}`;

        },
        game_result: function(result) {
            this.initialText = 'the result was ' + result == 0 ? 'heads' : 'tails';
        },
        you_win: function() {
            this.initialText = 'you win';
        },
        you_lose: function() {
            this.initialText = 'you lose';
        }
    }
}
</script>

<style scoped>

</style>