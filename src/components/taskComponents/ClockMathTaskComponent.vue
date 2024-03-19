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

  const imageUrl = computed(() => {
    return props.baseUrl && props.task?.imagePath
    ? props.baseUrl + props.task.imagePath : '';
  });
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

  const attempts = ref(0);
  const wrongAnswer = ref(false);

  const checkAnswer = (choiceId: number) => {
    if (finished.value)
      return;
    attempts.value++;
    const solution = parseInt(props.task?.answer);
    if (choiceId === solution) {
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
    <div class="image-container">
      <img v-if="imageUrl" :src="imageUrl" class="task-img">
    </div>
    <div class="choices">
      <div 
        v-for="choice in task?.choices"
        :key="choice.id"
        class="choice"
        :class="{ 'correct': finished && choice.id === parseInt(props.task?.answer)}"
        @click="checkAnswer(choice.id)"
      >
        {{ choice.text }}
    </div>
    </div>
    <div class="submit">
      <div class="buttons"> 
        <button @click="skipTask" v-if="!finished">Too Hard</button>
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
    font-size: xx-large;
    text-align: center;
    margin-left: 20px;
    margin-top: 10px;
    margin-bottom: 10px;
  }

  .image-container {
    text-align: center;
  }

  .task-img {
    width: 300px;
  }

  .choice {
    border-style: solid;
    border-width: 2px;
    border-radius: 5px;
    width: 100px;
    margin: auto;
    margin-top: 10px;
    font-size: large;
  }

  .correct {
    background-color: springgreen;
  }

  .submit {
    margin-top: 10px;
    margin-bottom: 10px;
    text-align: center;
  }

  .buttons {
    margin-bottom: 10px;
  }

</style>