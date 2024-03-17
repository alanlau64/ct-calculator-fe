<script setup lang="ts">
  import { ref, watch, computed } from 'vue'

  const props = defineProps({
    task: Object,
    taskType: Number,
    taskLevel: Number,
    baseUrl: String
  });
  const emit = defineEmits(['finish']);

  const finished = ref(false);

  const instructionAudioUrl = computed(() => {
    return props.baseUrl && props.task?.instruction?.instructionAudioPath 
    ? props.baseUrl + props.task.instruction.instructionAudioPath : '';
  });
  const instructionText = computed(() => {
    return props.task?.instruction?.text 
    ? props.task.instruction.text : 'placeholder';
  });

  const audio = new Audio();
  const playAudio = () => {
    audio.src = instructionAudioUrl.value;
    audio.play();
  }

  const answer = ref('');

  const attempts = ref(0);
  const wrongAnswer = ref(false);

  const checkAnswer = () => {
    attempts.value++;
    const userAnswer = parseInt(`${answer.value}`);
    const solution = parseFloat(props.task?.answer);
    if (userAnswer === solution) {
      finished.value = true;
      wrongAnswer.value = false;
    } else {
      wrongAnswer.value = true;
    }
  }

  const submit = () => {
    emit('finish', props.taskType, props.taskLevel, 1 / attempts.value);
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
    <div class="input-area">
      <input type="number" v-model="answer" :disabled="finished">
    </div>
    <div class="submit">
      <div class="buttons">
        <button @click="checkAnswer" v-if="!finished">Done</button>
        <button @click="skipTask" v-if="!finished">Too Hard</button>
        <button @click="submit" v-else>Next</button>
      </div>
      <span v-if="wrongAnswer"> Answer is <b>incorrect</b> <br> Please <b>try again</b> or click <b>Too Hard</b> button to skip</span>
      <span v-if="finished">Correct, click <b>Next</b> to continue</span>
    </div>
  </div>
  
</template>

<style scoped>
  input[type="number"]::-webkit-inner-spin-button,
  input[type="number"]::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  input[type="number"] {
    appearance: textfield;
    -moz-appearance: textfield; /* For Firefox */
  }

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
    margin-top: 10px;
    margin-bottom: 10px;
    margin-left: 10px;
  }

  .instruction-text {
    font-weight: bold;
    font-size: 20px;
    text-align: center;
    margin-left: 20px;
    margin-top: 10px;
    margin-bottom: 10px;
  }

  .image-container {
    text-align: center;
  }

  .input-area {
    font-size: 30px;
    text-align: center;
    margin-bottom: 10px;
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
  }

  input {
    width: 50px;
  }

</style>