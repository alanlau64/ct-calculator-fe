<script setup lang="ts">
  import WelcomeScreen from './screens/WelcomeScreen.vue';
  // import DemographicScreen from './screens/DemographicScreen.vue';
  import SelectSkillScreen from './screens/SelectSkillScreen.vue';
  import SubjectiveAssessmentScreen from './screens/SubjectiveAssessmentScreen.vue';
  import ObjectiveAssessmentScreen from './screens/ObjectiveAssessmentScreen.vue';
  import PredictionScreen from './screens/PredictionScreen.vue';
  import { ref } from 'vue'

  const showScreen = ref(0)
</script>

<template>
  <div class="header">
    <img src="./assets/BULogo.png" width="150" />
    <img src="./assets/cth-logo-small.webp" width="300" />
  </div>
  <WelcomeScreen v-if="showScreen === 0" @next-screen="showScreen++"></WelcomeScreen>
  <!-- <DemographicScreen v-else-if="showScreen === 1" @next-screen="showScreen++"></DemographicScreen> -->
  <SelectSkillScreen v-else-if="showScreen === 1" @previous-screen="showScreen--" @next-screen="showScreen++"></SelectSkillScreen>
  <SubjectiveAssessmentScreen v-else-if="showScreen === 2" @previous-screen="showScreen--" @next-screen="showScreen++"></SubjectiveAssessmentScreen>
  <ObjectiveAssessmentScreen v-else-if="showScreen === 3" @next-screen="showScreen++"></ObjectiveAssessmentScreen>
  <PredictionScreen v-else-if="showScreen === 4" @start-over="showScreen = 0"></PredictionScreen>
</template>

<style>
  .header {
    display: flex;
    align-items: center;
    column-gap: 3em;
  }

  .header img {
    display: inline-block;
    padding: 5px;
  }
</style>