<script setup lang="ts">

import { store } from '../store.js'

interface ConditionMap {
  [key: number]: string
}

const conditionMap: ConditionMap = {
  1: "Less than 1 month",
  2: "2-3 months",
  3: "4-6 months", 
  4: "7-12 months",
  5: "1-5 years",
  6: "More than 5 years"
}

</script>

<template>
  <div class="age">
    <p>Your age: </p>
    <input v-model="store.age" type="number" min="0" max="120" placeholder=0>
  </div>
  <div class="sex">
    <p>Your sex: </p>
    <select v-model="store.sex">
      <option disabled selected value="">Select One</option>
      <option>Male</option>
      <option>Female</option>
      <option>Other</option>
    </select>
  </div>
  <div class="conditon">
    <p>How long ago was the first condition diagnosed?</p>
    <select v-model.number="store.conditionSince">
      <option disabled selected value=0>Select One</option>
      <option v-for="(value, key) in conditionMap" :key="key">
        {{ value }}
      </option>
    </select>
  </div>
  <div class="nextPage">
    <button @click="$emit('next-screen')">Next</button>
  </div>
</template>

<style>

</style>