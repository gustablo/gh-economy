<template>
    <div>
        <h2>{{ resultAnimation }}X</h2>
        <v-text-field type="number" label="GH$" v-model="amount"></v-text-field>
        <v-btn @click="start">start</v-btn>
    </div>

</template>

<script>
import { nextTick } from '@vue/runtime-core';
import { bet } from '../../api/bet'
export default {
    name: 'Crash',
    
    data() {
        return {
            amount: 0,
            result: 0,
            resultAnimation: 0,
        }
    },

    methods: {
        start() {
            this.result = 0;
            this.resultAnimation = 0;

            bet('CRASH', this.amount, {})
                .then(result => {
                    this.result = result.options.multipler;

                    this.startAnimation();
                })
        },

        startAnimation() {
            const interval = setInterval(() => {
                if (this.resultAnimation >= this.result) {
                    nextTick(() => {
                        this.resultAnimation = this.result.toFixed(2);
                    })
                    clearInterval(interval);
                    return;
                }

                this.resultAnimation = parseFloat((this.resultAnimation + 0.01).toFixed(2));

            }, 80);
        },
    }
}
</script>

<style>

@import url("https://fonts.googleapis.com/css2?family=Poppins&display=swap");

* {
  font-family: "Poppins" !important;
}
</style>