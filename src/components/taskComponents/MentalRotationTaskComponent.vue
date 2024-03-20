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

  const getResourceUrl = (src: string) => {
    return props.baseUrl ? props.baseUrl + src : "";
  }

  const attempts = ref(0);
  const wrongAnswer = ref(false);

  const checkAnswer = (choice: boolean) => {
    if (finished.value)
      return;
    finished.value = true;
    if (choice === props.task?.answer) {
      wrongAnswer.value = false;
    } else {
      wrongAnswer.value = true;
    }
  }

  const submit = () => {
    emit('finish', props.taskType, props.taskLevel, wrongAnswer ? 0 : 1);
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
      <div v-for="stimulus in props.task?.stimulus" >
        <img :src="getResourceUrl(stimulus.imagePath)" class="task-img" :style="{transform: 'rotate(' + stimulus.imageRotation + 'deg)'}">
      </div>
    </div>
    <div class="choices">
      <div 
        class="choice" 
        @click="checkAnswer(true)"
        :class="{'correct': finished && !wrongAnswer && props.task.answer, 'wrong': wrongAnswer && !props.task.answer}">
        Yes
      </div>
      <div 
        class="choice" 
        @click="checkAnswer(false)"
        :class="{'correct': finished && !wrongAnswer && !props.task.answer, 'wrong': wrongAnswer && props.task.answer}">
        No
      </div>
    </div>
    <div class="submit">
      <div class="buttons"> 
        <button @click="skipTask" v-if="!finished">Too Hard</button>
        <button @click="submit" v-else>Next</button>
      </div>
      <span v-if="wrongAnswer"> Answer is <b>incorrect</b>, click <b>Next</b> to continue </span>
      <span v-else-if="finished"> Correct, click <b>Next</b> to continue </span>
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
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
  }

  .task-img {
    width: 250px;
    margin-left: 20px;
    margin-right: 20px;
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

  .wrong {
    background-color: red;
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