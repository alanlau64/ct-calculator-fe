<script setup lang="ts">
  import { ref, computed, onMounted } from 'vue'

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

  const audio = new Audio();
  const playAudio = (src: string) => {
    audio.src = src;
    audio.play();
  }

  const shuffle  = (inArr: any[]) => {
    let arr = Object.assign([], inArr);
    let currentIndex = arr.length, randomIndex: number;
    while (currentIndex > 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
      [arr[currentIndex], arr[randomIndex]] = [arr[randomIndex], arr[currentIndex]];
    }
    return arr;
  }

  const choices = computed(() => {
    if (!props.task)
      return [];
    else {
      return shuffle([...props.task.distractors, props.task.segments[props.task.missingSegment]]);
    }
  })

  const answer = computed(() => props.task ? props.task.segments[props.task.missingSegment].text : "")

  const attempts = ref(0);
  const dragging = ref(0);
  const isWrong = ref(props.task?.choices ? new Array(choices.value.length).fill(false) : []);

  const onDrop = () => {
    const curDragging = choices.value[dragging.value]
    attempts.value++;
    if (answer.value === curDragging.text) {
      dragging.value = 0;
      done();
    } else {
      isWrong.value[dragging.value] = true;
      setTimeout(() => {
        isWrong.value[dragging.value] = false;
      }, 3000)
    }
  }

  const done = () => {
    finished.value = true
    finishText.value = `Correct, click <b>Next</b> to continue`
  }

  const submit = () => {
    if (!props.task || !choices)
      return;
    emit('finish', props.taskType, props.taskLevel, 1 / attempts.value)
  }

  const skipTask = () => {
    emit('finish', props.taskType, props.taskLevel, 0);
  }

</script>

<template>
  <div class="task-container">
    <div class="instruction-container">
      <button @click="playAudio(instructionAudioUrl)" class="audio-btn">Play Audio</button>
      <p class="instruction-text">{{ instructionText }}</p>
    </div>
    <div class="content-container">
      <div class="answer-container">
        <div
          v-for="(segment, index) in props.task?.segments"
          class="answer-text"
          :class="{'answer-box': index === props.task?.missingSegment}"
          @dragover.prevent
          @drop.stop.prevent="onDrop()">
          <p>{{ finished ? segment.text : index === props.task?.missingSegment ? "" : segment.text }}</p>
        </div>
      </div>
      <div class="items-container">
        <div 
          v-for="(word, index) in choices"
          class="word-box"
          :class="{'wrong': isWrong[index], 'correct': finished && word.text === answer}"
          :draggable="!isWrong[index] && !finished"
          @drag="dragging = index">
          {{ finished && word.text === answer ? "" : word.text }}
        </div>
      </div>
    </div>
    
    <div class="submit">
      <div class="buttons">
        <button @click="skipTask" v-if="!finished">Too Hard</button>
        <button @click="submit" v-else>Next</button>
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

  .content-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  .items-container {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
  }

  .word-box {
    border: 2px solid black;
    border-radius: 20px;
    margin: auto;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-left: 20px;
    margin-right: 20px;
    width: 120px;
    height: 30px;
    font-size: large;
  }

  .wrong {
    background-color: red;
  }
  
  .correct {
    border: none;
    background-color: transparent;
  }

  .answer-container {
    margin-top: 20px;
    margin-bottom: 20px;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
  }

  .answer-text {
    font-size: large;
    font-weight: bold;
    width: 6em;
  }

  .answer-box {
    border: 1px solid #ccc;
    background-color: #f8f8f8;
    width: 6em;
    height: 30px;
    margin: auto;
    display: flex;
    justify-content: center;
    align-items: center;
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