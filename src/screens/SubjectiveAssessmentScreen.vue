<script setup lang='ts'>
  import { ref, computed, onMounted, watch } from 'vue';
  import { store } from '../store';
  import { assessments } from '../assessments.json'

  const emit = defineEmits(['previous-screen', 'next-screen'])
  const questions = ref(assessments);
  const answers = ref<Array<string>>([]);

  const initializeAnswers = () => {
    answers.value = new Array(questionsForSkill.value.length).fill(0)
  }

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

  const questionsForSkill = computed(() => questions.value[store.skill.toString() as "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9"] || []);

  onMounted(() => {
    initializeAnswers();
  });

  watch(questionsForSkill, () => {
    initializeAnswers();
  });

  const allAnswered = computed(() => {
    return answers.value.every(answer => parseInt(answer) !== 0)
  })

  const permutation = computed(() => {
    switch (store.skill) {
      case 1:
        if (answers.value.every(answer => parseInt(answer) === 5))
          return 18;
        else if (answers.value.every(answer => parseInt(answer) < 5))
          return 16;
        else 
          return 37;
      case 2:
        if (answers.value.every(answer => parseInt(answer) === 5))
          return 24;
        else if (answers.value.every(answer => parseInt(answer) < 5))
          return 22;
        else 
          return 23;
      case 3:
        const ans_slice3 = answers.value.slice(4)
        if (ans_slice3.every(answer => parseInt(answer) === 5))
          return 36;
        else if (ans_slice3.every(answer => parseInt(answer) < 5))
          return 25;
        else
          return 35;
      case 4:
        if (answers.value.every(answer => parseInt(answer) === 5))
          return 8;
        else if (answers.value.every(answer => parseInt(answer) < 5))
          return 7;
        else 
          return 12;
      case 5:
        if (answers.value.every(answer => parseInt(answer) === 5))
          return 6;
        else if (answers.value.every(answer => parseInt(answer) < 5))
          return 5;
        else 
          return 11;
      case 6:
        if (answers.value.every(answer => parseInt(answer) < 5))
          return 19;
        else 
          return 20;
      case 7:
        if (answers.value.every(answer => parseInt(answer) === 5))
          return 15;
        else if (answers.value.every(answer => parseInt(answer) < 5))
          return 13;
        else 
          return 14;
      case 8:
        if (answers.value.every(answer => parseInt(answer) === 5))
          return 2;
        else if (answers.value.every(answer => parseInt(answer) < 5))
          return 1;
        else 
          return 9;
      case 9:
        const ans_slice9 = answers.value.slice(2)
        if (ans_slice9.every(answer => parseInt(answer) < 5))
          return 3;
        else
          return 10;
    }
  })

  const handlePrevious = () => {
    store.permutation = 0;
    emit('previous-screen');
  }

  const handleNext = () => {
    if (permutation.value !== undefined) {
      store.permutation = permutation.value
      emit('next-screen')
    } else {
      alert("Error")
    }
  }
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
      <button @click="handlePrevious">Previous</button>
    </div>
    <div>
      <button @click="handleNext" :disabled="!allAnswered">Next</button>
    </div>
  </div>
</template>

<style scoped>
  .nextPage {
      padding-top: 20px;
      display: block;
      text-align: center;
    }
</style>