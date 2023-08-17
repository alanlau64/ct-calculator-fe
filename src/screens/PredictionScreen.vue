<script setup lang="ts">
  import { store } from '../store'
  import { ref, computed } from 'vue'

  const curLandmark = ref(0)
  const landmarks = ref([
    "Arrange written words in alphabetical order",
    "Arrange multiple word lists in alphabetical order",
    "Organize and sequence steps to everyday tasks",
    "Use problem solving to put abstract information in order",
    "Interpret functional, everyday maps"
  ])

  const res = ref(30);

  const filteredLandmarks = computed(() => {
    return landmarks.value.slice(curLandmark.value + 1)
  })
</script>

<template>
  <div class="initialLevel">
    <p>Now you are able to <b>{{ landmarks[0] }}.</b></p>
  </div>
  <div>
    <span>
      To achieve
      <select v-model="store.selectedLandmark">
        <option v-for="value in filteredLandmarks" :key="value" :value="value"> {{ value }} </option>
      </select>
    </span>
  </div>
  <div>
    <span>
      And you want to practice
      <select v-model="store.selectedTimesPerWeek">
        <option v-for="times in 7" :key="times" :value="times"> {{ times }} </option>
      </select>
      times per week and
      <input v-model="store.selectedAmount" type="number" min="0" max="3600">
      minutes per week
    </span>
  </div>
  <div>
    You will need {{ res }} days
  </div>
  <div class="nextPage">
    <div>
      <button @click="$emit('start-over')">Start Over</button>
    </div>
  </div>
</template>

<style>
  .nextPage {
      padding-top: 20px;
      display: block;
      text-align: center;
    }
</style>