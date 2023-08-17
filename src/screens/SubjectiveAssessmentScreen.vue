<script setup lang='ts'>
  import { ref, computed } from 'vue';
  import { store } from '../store';
  import { assessments } from '../assessments.json'

  const questions = ref(assessments);
  const answers = ref<Array<number>>([]);

  interface scoreMap {
    [key: number]: string
  }
  const scores: scoreMap = {
    1: "Not at all",
    2: "Poorly", 
    3: "Fairly well",
    4: "Very well",
    5: "Extremely well"
  }

  const questionsForSkill = computed(() => questions.value[store.skill] || []);
</script>

<template>
  <div>
    <div v-for="(question, index) in questionsForSkill" :key="index">
      <div v-html="question"></div>
      <div v-for="(text, score) in scores" :key="score">
        <input type="radio" :name="'question_' + index" :value="score" v-model="answers[index]" />
        <label :for="'question_' + index">{{ text }}</label>
      </div>
    </div>
  </div>
  <div class="nextPage">
    <div>
      <button @click="$emit('previous-screen')">Previous</button>
    </div>
    <div>
      <button @click="$emit('next-screen')">Next</button>
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