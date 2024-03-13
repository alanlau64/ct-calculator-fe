<script setup lang="ts">
  import { ref, computed, reactive } from 'vue'

  const props = defineProps({
    task: Object,
    taskType: Number,
    taskLevel: Number,
    baseUrl: String
  });
  const emit = defineEmits(['finish']);

  const finished = ref(false);
  const finishText = ref("");
  const instructionAudioUrl = computed(() => {
    return props.baseUrl && props.task?.instruction?.instructionAudioPath 
    ? props.baseUrl + props.task.instruction.instructionAudioPath : '';
  });
  const instructionText = computed(() => {
    return props.task?.instruction?.text 
    ? props.task.instruction.text : 'placeholder';
  });

  const answers = computed(() => {
    return props.task?.matchingSymbols ? [props.task.matchingSymbols[0].imagePath, props.task.matchingSymbols[1].imagePath] : []
  })
  const answerIsZero = ref(true);

  const audio = new Audio();
  const playAudio = () => {
    audio.src = instructionAudioUrl.value;
    audio.play();
  }

  const loadImageUrl = (imagePath: string) => {
    return props.baseUrl ? props.baseUrl + imagePath : '';
  }

  const items = computed(() => {
    return props.task?.items ? props.task.items : []
  })
  const isCorrect = ref(props.task?.items ? new Array(props.task.items.length).fill(false) : []);
  const isWrong = ref(props.task?.items ? new Array(props.task.items.length).fill(false) : []);

  const attempts = ref(0);
  const correctNum = ref(0);

  const clickAnswer = (index: number) => {
    if (isCorrect.value[index] || finished.value || items.value[index] === "en/tasks/symbol_tasks/Blank_Square.png")
      return;
    const answer = answerIsZero.value ? answers.value[0] : answers.value[1]
    if (items.value[index] === answer) {
      attempts.value += 1;
      correctNum.value += 1;
      isCorrect.value[index] = true;
      answerIsZero.value = !answerIsZero.value;
    }
    else if (!isWrong.value[index]) {
      attempts.value += 1;
      isWrong.value[index] = true;
      setTimeout(() => {
        isWrong.value[index] = false;
      }, 3000);
    }
  }

  const done = () => {
    finished.value = true
    if (correctNum.value == 0) {
      finishText.value = `Incorrect, click <b>Next</b> to continue`
    } else if (correctNum.value < props.task?.matchingSymbols[0].number * 2) {
      finishText.value = `Partially Correct, click <b>Next</b> to continue`
    } else {
      finishText.value = `Correct, click <b>Next</b> to continue`
    }
  }

  const submit = () => {
    if (!props.task)
      return;
    let acc = 0;
    if (attempts.value === 0) {
      acc = 0;
    } else if (correctNum.value === props.task.matchingSymbols[0].number * 2) {
      acc = correctNum.value / attempts.value;
    } else {
      acc = Math.min(correctNum.value / attempts.value, correctNum.value / props.task.matchingSymbols[0].number * 2)
    }
    emit('finish', props.taskType, props.taskLevel, acc)
  }

  const skipTask = () => {
    emit('finish', props.taskType, props.taskLevel, 0);
  }

</script>

<template>
  <div class="task-container">
    <div class="instruction-container">
      <button @click="playAudio" class="audio-btn">Play Audio</button>
      <p class="instruction-text">{{ instructionText }}</p>
    </div>
    <div class="answer-symbol-container">
      <span>1</span>
      <img v-if="answers" :src="loadImageUrl(answers[0])" class="answer-symbol-img" width="200">
      <span>2</span>
      <img v-if="answers" :src="loadImageUrl(answers[1])" class="answer-symbol-img" width="200">
    </div>
    <div class="items-container">
        <div 
        v-for="(item, index) in items" 
        class="item-container"
        :class="{ 'is-correct': isCorrect[index], 'is-wrong': isWrong[index], 'is-blank': item === 'en/tasks/symbol_tasks/Blank_Square.png' }"
        :key="index"
        @click="clickAnswer(index)">
            <img :src="loadImageUrl(item)" width="40">
        </div>
    </div>
    <div class="submit">
      <div class="buttons">
        <button @click="done" v-if="!finished">Done</button>
        <button @click="submit" v-else>Next</button>
        <button @click="skipTask" v-if="!finished">Too Hard</button>
      </div>
      <span v-if="finished" v-html="finishText"></span>
    </div>
  </div>
  
</template>

<style scoped>
  .task-container {
    margin: auto;
    border-style: solid;
    border-color: black;
    border-width: 1px;
    border-radius: 5%;
    width: 50%;
    text-align: center;
  }

  .instruction-container {
    display: inline-flex;
  }

  .audio-btn {
    height: 20px;
    margin-top: auto;
    margin-bottom: auto;
  }

  .instruction-text {
    font-weight: bold;
    font-size: x-large;
    text-align: center;
    margin-left: 20px;
    margin-top: 10px;
    margin-bottom: 10px;
  }

  .answer-symbol-container {
    text-align: center;
    display: flex;
    align-items: flex-start;
    justify-content: center;
  }

  .answer-symbol-img {
    margin-left: 10px;
    margin-right: 10px;
  }

  .items-container {
    padding-left: 100px;
    padding-right: 100px;
    display: grid;
    gap: 10px;
    grid-template-columns: repeat(7, 1fr);
  }

  .item-container {
    border: 1px solid #ccc;
    background-color: #f8f8f8;
    width: 50px;
    margin: auto;
    text-align: center;
  }

  .is-blank {
    border: none;
    background-color: transparent;
  }

  .is-correct {
    background-color: springgreen;
  }

  .is-wrong {
    background-color: red;
  }

  .submit {
    margin-top: 30px;
    margin-bottom: 10px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  .buttons {
    display: flex;
    column-gap: 20px;
    margin-bottom: 10px;
  }

</style>