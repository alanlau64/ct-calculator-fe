<script lang="ts">
  import WelcomeScreen from './screens/WelcomeScreen.vue';
  import DemographicScreen from './screens/DemographicScreen.vue';
  import SelectSkillScreen from './screens/SelectSkillScreen.vue';
  import SubjectiveAssessmentScreen from './screens/SubjectiveAssessmentScreen.vue';
  import ObjectiveAssessmentScreen from './screens/ObjectiveAssessmentScreen.vue';
import PredictionScreen from './screens/PredictionScreen.vue';
  export default {
    components: {
    WelcomeScreen,
    DemographicScreen,
    SelectSkillScreen,
    SubjectiveAssessmentScreen,
    ObjectiveAssessmentScreen,
    PredictionScreen
},

    data () {
      return {
        showScreen: 0
      }
    }
  }
</script>

<template>
  <h4>Constant Therapy Calculator</h4>
  <WelcomeScreen v-if="showScreen === 0" @next-screen="showScreen++"></WelcomeScreen>
  <DemographicScreen v-else-if="showScreen === 1" @next-screen="showScreen++"></DemographicScreen>
  <SelectSkillScreen v-else-if="showScreen === 2" @previous-screen="showScreen--" @next-screen="showScreen++"></SelectSkillScreen>
  <SubjectiveAssessmentScreen v-else-if="showScreen === 3" @previous-screen="showScreen--" @next-screen="showScreen++"></SubjectiveAssessmentScreen>
  <ObjectiveAssessmentScreen v-else-if="showScreen === 4" @previous-screen="showScreen--" @next-screen="showScreen++"></ObjectiveAssessmentScreen>
  <PredictionScreen v-else-if="showScreen === 5" @start-over="showScreen = 0"></PredictionScreen>
</template>