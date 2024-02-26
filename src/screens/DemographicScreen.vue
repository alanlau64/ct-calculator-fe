<script setup lang="ts">

  import { store } from '../store.js'
  import { computed } from 'vue'

  const emit = defineEmits(['next-screen'])

  interface ConditionMap {
    [key: number]: string
  }

  const conditionMap: ConditionMap = {
    1: "Less than 1 month",
    2: "1-3 months",
    4.5: "3-6 months", 
    9: "6-12 months",
    36: "1-5 years",
    60: "More than 5 years"
  }

  const disable = computed(() => {
    return store.conditionSince === 0 || !store.conditionSince || store.age <= 0 || !store.age
  })

  const handleNext = () => {
    if (store.age < 18) {
      alert("You have to be 18 years old to participate");
    }
    else
      emit('next-screen')
  }
</script>

<template>
  <div class="age">
    <p>Your age: </p>
    <input v-model="store.age" type="number" min="0" max="120" placeholder=0>
  </div>
  <div class="conditon">
    <p>How long ago was the first condition diagnosed?</p>
    <select v-model.number="store.conditionSince">
      <option disabled selected value=0>Select One</option>
      <option v-for="(value, key) in conditionMap" :key="key" :value="key">
        {{ value }}
      </option>
    </select>
  </div>
  <div class="nextPage">
    <button @click="handleNext" :disabled="disable">Next</button>
  </div>
</template>

<style>

</style>