<script setup lang="ts">
  import { store, resetStore } from '../store'
  import { ref, computed } from 'vue'
  import { domains } from '../mapping.json'
  import ProgressionBarComponent from '../components/ProgressBarComponent.vue'

  const emit = defineEmits(['start-over']);

  const curLandmark = ref(-1);
  const status = ref('waiting');
  const length = ref(store.selectedLength);
  const prediction = ref({});
  const landmarkText = ref('');
  const confidence = ref(0);

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

  const disable = computed(() => store.conditionSince === 0  || store.age < 18 || !store.age || !store.conditionSince)

  const predict = async () => {
    // http://127.0.0.1:3000/predict
    // https://ts0100n96d.execute-api.us-east-2.amazonaws.com/predict
    status.value = 'loading';
    try {
      const response = await fetch("https://ts0100n96d.execute-api.us-east-2.amazonaws.com/predict", {
        method: "POST",
        body: JSON.stringify({
          assessmentId: store.assessmentId,
          age: store.age,
          conditionSince: store.conditionSince,
          accuracy: store.accuracies
        })
      })

      const data = await response.json();
      length.value = data.length;
      prediction.value = data.prediction;
      landmarkText.value = data.landmarkText;
      curLandmark.value = data.userLandmark;
      confidence.value = parseFloat(data.confidence)
    } catch (err) {
      status.value = 'err';
    } finally {
      status.value = 'ready';
    }
  }

  const probability = computed(() => {
    if (prediction.value && store.selectedFrequency && store.selectedLength) {
      return (prediction.value as any)[store.selectedFrequency][store.selectedLength]
    }
      
    else
      return 0
  })

  const progressionClassName = computed(() => {
    if (probability.value < 0.5) 
      return 'gray';
    else if (probability.value < 0.75) 
      return 'gold';
    else if (probability.value < 0.9)
      return 'dodgerblue';
    else
      return 'springgreen';
  })

  const progressionText = computed(() => {
    if (probability.value < 0.5) 
      return "You need additional practice to improve to next landmark <br>";
    else if (probability.value < 0.75) 
      return "Your have <b>Moderate</b> chance to improve to next landmark <br>";
    else if (probability.value < 0.9)
      return "Your have <b>High</b> chance to improve to next landmark <br>";
    else
      return "Your have <b>Very High</b> chance to improve to next landmark <br>";
  })

  const startOver = () => {
    resetStore();
    emit('start-over');
  }
</script>

<template>
  <div class="demo-input">
    <div class="age">
      <div>
        Your age:&ensp;
        <input v-model="store.age" type="number" min="0" max="120" placeholder=0 :disabled="status !== 'waiting'">
      </div>
      <div class="age-slider">
        <Slider v-model="store.age" :min="18" :max="120" :step="1" :disabled="status !== 'waiting'"/>
      </div>
    </div>
    <div class="conditon">
      Time since injury:&ensp;
      <div class="condition-container">
        <div 
          v-for="(value, key) in conditionMap" 
          class="condition-div" 
          :class="{'selected-condition': store.conditionSince === key}"
          @click="status === 'waiting' ? store.conditionSince = key : {}">
          {{ value }}
        </div>
      </div>
    </div>
  </div>
  <div class="load">
    <div v-if="status === 'waiting'">
      <button @click="predict" :disabled="disable">Calculate</button>
    </div>
    <div v-if="status === 'loading'">
      <div> <ProgressSpinner /> </div>
      <div> Preparing predictions for you... </div>
    </div>
  </div>
  <div v-if="status === 'ready'">
    <div class="parameter-input">
      <div class="sub-parameter-input">
        <input v-model="store.selectedFrequency" type="number" min="1" max="7" step="1" placeholder="1"/>(days per week)
        <Slider v-model="store.selectedFrequency" :min="1" :max="7" :step="1"/>
        Desired practice frequency 
      </div>
      <div class="sub-parameter-input">
        <input v-model="store.selectedLength" type="number" min="1" max="52" step="1" placeholder="1"/> (weeks)
        <Slider v-model="store.selectedLength" :min="1" :max="52" :step="1" />
        Desired total practice time 
      </div>
    </div>
    <div class="ability">
      <div>
        Your current ability level in <b>{{ domains.find(x => x.id == store.domain[0])?.layman_name }}</b> is <br> <b>{{ landmarkText[curLandmark] }}</b>. 
      </div>
      <ProgressionBarComponent :landmark="curLandmark" :texts="landmarkText" />
    </div>
    <div class="prediction-text">
      <div v-if="!prediction">
        Sorry, we do not have enough data for your prediction.
      </div>
      <div v-else>
        <div v-if="store.selectedFrequency && store.selectedLength">
          <div>
            <ProgressBar :value="probability * 100" :show-value="false" :class="progressionClassName"></ProgressBar>
          </div>
          
          <div style="margin: auto;" v-html="progressionText"></div>
          <div class="con">
            Our confidence for the prediction is {{ confidence * 100 }}%
          </div>
        </div>
        <div v-else>
          Please select your desired frequency and practice time! <br>
        </div>
      </div>
    </div>
    <div class="nextPage">
      <div>
        <button @click="startOver">Start Over</button>
      </div>
    </div>
  </div>
  
</template>

<style scoped>
  .demo-input {
    padding-top: 2rem;
    display: flex;
    align-items: center;
    justify-content: center;
    column-gap: 20rem;
  }

  .age-slider {
    margin-top: 20px;
  }

  .condition-container {
    display: grid;
    gap: 10px;
    grid-template-columns: repeat(2, 1fr);
    text-align: center;
    margin-top: 10px;
  }

  .condition-div {
    border: solid 1px;
    padding: 5px;
    border-radius: 25px;
    font-size: 15px;
  }

  .selected-condition {
    background-color: springgreen;
  }

  .load {
    padding-top: 2rem;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .parameter-input {
    display: flex;
    align-items: center;
    justify-content: center;
    column-gap: 20rem;
    width: 100em;
    margin: auto;
    margin-bottom: 20px;
  }

  .sub-parameter-input {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    row-gap: 1em;
  }

  .sub-parameter-input > .p-slider {
    flex-grow: 1;
    min-width: 30em;
  }

  .nextPage {
    padding-top: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .ability {
    margin-top: 4em;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    row-gap: 2em;
  }

  .prediction-text {
    width: 1000px;
    margin: auto;
    margin-top: 4em;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .con {
    font-size: 10px;
  }
  
  .p-progressbar {
    min-width: 600px;
  }

  .gray :deep(.p-progressbar-value) {
    background-color: gray;
  }

  .gold :deep(.p-progressbar-value) {
    background-color: gold;
  }

  .dodgerblue :deep(.p-progressbar-value) {
    background-color: dodgerblue;
  }
</style>
