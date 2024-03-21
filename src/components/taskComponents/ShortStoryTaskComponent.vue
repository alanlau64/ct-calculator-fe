<script setup lang="ts">
  import { ref, computed } from 'vue'

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

  const getResourceUrl = (src: string) => {
    return props.baseUrl ? props.baseUrl + src : "";
  }

  const shuffle = (inArr: any[]) => {
    let arr = Object.assign([], inArr);
    let currentIndex = arr.length, randomIndex: number;
    while (currentIndex > 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
      [arr[currentIndex], arr[randomIndex]] = [arr[randomIndex], arr[currentIndex]];
    }
    return arr;
  }

  const audio = new Audio();
  const playAudio = (src: string) => {
    audio.src = src;
    audio.play();
  }

  const ready = ref(false);
  const wrongAnswer = ref(false);
  const curQuestionIdx = ref(0);
  const accuracy : number[] = [];

  const question = computed(() => props.task?.questions ? props.task.questions[curQuestionIdx.value].question : "" )
  const answer = computed(() => props.task?.questions ? props.task.questions[curQuestionIdx.value].answer : "" )
  const choices = computed(() => props.task?.questions ? shuffle(props.task.questions[curQuestionIdx.value].choices) : [])

  const attempts = ref(0);

  const checkAnswer = (choice: string) => {
    if (finished.value)
      return;
    attempts.value++;
    if (choice === answer.value) {
      finished.value = true;
      wrongAnswer.value = false;
    } else {
      wrongAnswer.value = true;
    }
  }

  const submit = () => {
    if (!props.task)
      return;
    if (curQuestionIdx.value !== props.task.questions?.length - 1) {
      finishText.value = "";
      finished.value = false
      wrongAnswer.value = false
      accuracy.push(1 / attempts.value);
      attempts.value = 0;
      curQuestionIdx.value++;
    }
    else {
      accuracy.push(1 / attempts.value);
      emit('finish', props.taskType, props.taskLevel, accuracy);
    }
  }

  const skipTask = () => {
    if (!props.task)
      return;
    if (curQuestionIdx.value !== props.task.questions?.length - 1) {
      finishText.value = "";
      finished.value = false
      wrongAnswer.value = false
      accuracy.push(0);
      attempts.value = 0;
      curQuestionIdx.value++;
    }
    else {
      accuracy.push(0);
      emit('finish', props.taskType, props.taskLevel, accuracy);
    }
  }

</script>

<template>
  <div class="task-container">
    <div class="instruction-container">
      <button @click="playAudio(instructionAudioUrl)" class="audio-btn">Play Audio</button>
      <p class="instruction-text">{{ instructionText }}</p>
    </div>
    <div class="content-container">
      <div class="audio-container">
        <audio controls controlslist="nodownload noplaybackrate" @ended="ready = true">
          <source :src="getResourceUrl(props.task?.audioPath)">
          Your browser does not support the audio element
        </audio>
      </div>
      <div class="answer-container">
        <p class="question">{{ ready ? question : props.task?.instruction?.choiceCoverText }}</p>
        <div
          v-for="choice in choices"
          class="choice"
          :class="{'correct': finished && choice === answer}"
          @click="checkAnswer(choice)"
          v-if="ready">
          <p>{{ choice }}</p>
        </div>
      </div>
    </div>
    
    <div class="submit">
      <div class="buttons">
        <button @click="skipTask" v-if="!finished" :disabled="!ready">Too Hard</button>
        <button @click="submit" v-else>Next</button>
      </div>
      <span class="wrong" v-if="wrongAnswer"> Answer is <b>incorrect</b> <br> Please <b>try again</b> or click <b>Too Hard</b> button to skip</span>
      <span class="finishText" v-if="finished"> Correct, click <b>Next</b> to continue </span>
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

  .content-container {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
  }

  .items-container {
    margin-right: 100px;
  }

  .choice {
    border-style: solid;
    border-width: 2px;
    border-radius: 5px;
    width: 250px;
    height: 50px;
    margin: auto;
    margin-top: 10px;
    font-size: large;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .correct {
    background-color: springgreen;
  }

  .answer-container {
    margin-left: 100px;
  }

  .answer-box {
    border: 1px solid #ccc;
    background-color: #f8f8f8;
    width: 100px;
    height: 50px;
    margin: auto;
    margin-bottom: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .correct-answer {
    background-color: springgreen;
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