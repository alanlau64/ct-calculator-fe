<script setup lang="ts">
  import { ref, watch, computed } from 'vue'

  const props = defineProps({
    task: Object,
    taskType: Number,
    taskLevel: Number,
    baseUrl: String
  });
  const emit = defineEmits(['finish']);

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
    const userAnswer = parseInt(`${answer.value}`);
    const solution = parseFloat(props.task?.answer);
    return userAnswer === solution;
  }

  const submit = () => {
    attempts.value++;
    if (checkAnswer()) {

      emit('finish', props.taskType, props.taskLevel, 1 / attempts.value);
    } else {
      wrongAnswer.value = true;
    }
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
      <input type="number" v-model="answer">
    </div>
    <div class="submit">
      <button @click="submit">Submit</button>
      <button @click="skipTask">Skip</button>
      <p class="wrong" v-if="wrongAnswer">Answer is incorrect, please try again</p>
    </div>
  </div>
  
</template>

<style>
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
    margin-top: 10px;
    margin-bottom: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
    column-gap: 20px;
  }

  input {
    width: 50px;
  }

</style>