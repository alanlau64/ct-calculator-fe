<script setup lang="ts">
  import { store, resetStore } from '../store'
  import { ref, computed } from 'vue'

  const emit = defineEmits(['start-over']);

  const curLandmark = ref('');
  const res = ref(false);
  const status = ref('waiting');
  const length = ref(store.selectedLength);
  const prediction = ref(false);
  const landmarkText = ref('');
  const nextLandmarkText = ref('');

  const predict = async () => {
    // http://127.0.0.1:3000/predict
    // https://ts0100n96d.execute-api.us-east-2.amazonaws.com/predict
    status.value = 'loading';
    try {
      const response = await fetch("https://ts0100n96d.execute-api.us-east-2.amazonaws.com/predict", {
        method: "POST",
        body: JSON.stringify({
          permutation: store.permutation,
          age: store.age,
          conditionSince: store.conditionSince,
          frequency: store.selectedFrequency,
          length: store.selectedLength,
          accuracy: store.accuracies
        })
      })

      const data = await response.json();
      length.value = data.length;
      prediction.value = data.prediction;
      landmarkText.value = data.landmarkText;
      nextLandmarkText.value = data.nextLandmarkText;
    } catch (err) {
      status.value = 'err';
    } finally {
      status.value = 'ready';
    }
  }

  const startOver = () => {
    resetStore();
    emit('start-over');
  }
</script>

<template>
  <div>
    <span>
      You want to practice
      <select v-model="store.selectedFrequency">
        <option v-for="times in 7" :key="times" :value="times" :disabled="status !== 'waiting'"> {{ times }} </option>
      </select>
      times per week and
      <input v-model="store.selectedLength" type="number" min="0" max="360" :disabled="status !== 'waiting'">
      days in total. 
    </span>
  </div>
  <div v-if="status === 'waiting'">
    <button @click="predict">Calculate</button>
  </div>
  <div v-if="status === 'loading'">
    Making prediction for you...
  </div>
  <div v-if="status === 'ready'">
    <span>
      Your current ability level is <b>{{ landmarkText }}</b>. 
    </span>
    <div v-if="prediction === true || prediction === false">
      <span>
        Next ability level is <b>{{ nextLandmarkText }}</b>
      </span>
      <div v-if="length !== store.selectedLength">
        You may not improve your ability level with your current selection. 
        <span v-if="prediction">
          But you can do it if you keep practicing for {{ length }} days. 
        </span>
      </div>
      <div v-else>
        You are likely to improve the next level within the time and frequency you selected. 
      </div>
    </div>
    <div v-else>
      Sorry, we do not have enough data to make prediction for your ability level. 
    </div>
    
    <div class="nextPage">
    <div>
      <button @click="startOver">Start Over</button>
    </div>
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