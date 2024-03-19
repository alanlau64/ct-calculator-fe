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

  const audio = new Audio();
  const playAudio = (src: string) => {
    audio.src = src;
    audio.play();
  }

  const words = computed(() => {
    return props.task?.items ? props.task.items : []
  })

  const shuffle  = (arr) => {
    let currentIndex = arr.length, randomIndex: number;
    while (currentIndex > 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
      [arr[currentIndex], arr[randomIndex]] = [arr[randomIndex], arr[currentIndex]];
    }
    return arr;
  }

  const shuffledWords = computed(() => {
    if (!words.value)
      return []
    else {
      return shuffle(Object.assign([], words.value))
    }
  })

  const attempts = ref(0);
  const dragging = ref(0);
  const isCorrect = ref(props.task?.items ? new Array(props.task.items.length).fill(false) : []);
  const isWrong = ref(props.task?.items ? new Array(props.task.items.length).fill(false) : []);

  const onDrop = (order: number) => {
    const curDragging = dragging.value
    attempts.value++;
    if (order === curDragging) {
      isCorrect.value[order-1] = true;
      dragging.value = 0;
      if (isCorrect.value.every(x => x === true))
        done();
    } else {
      isWrong.value[curDragging - 1] = true;
      setTimeout(() => {
        isWrong.value[curDragging - 1] = false;
      }, 3000)
    }
  }

  const done = () => {
    finished.value = true
    finishText.value = `Correct, click <b>Next</b> to continue`
  }

  const submit = () => {
    if (!props.task || !words)
      return;
    emit('finish', props.taskType, props.taskLevel, attempts.value / words.value.length)
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
      <div class="items-container">
        <div 
          v-for="(word, index) in shuffledWords"
          class="word-box"
          :class="{'correct-word': isCorrect[word.order-1], 'wrong-word': isWrong[word.order-1]}"
          :draggable="!isCorrect[word.order-1] && !isWrong[word.order-1]"
          @drag="dragging = word.order">
          <p>{{ isCorrect[word.order-1] ? "" : word.name }}</p>
        </div>
      </div>
      <div class="answer-container">
        <div
          v-for="word in words"
          class="answer-box"
          :class="{'correct-answer': isCorrect[word.order-1]}"
          @dragover.prevent
          @drop.stop.prevent="onDrop(word.order)">
          <p>{{ isCorrect[word.order-1] ? word.name : "" }}</p>
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
    flex-direction: row;
    align-items: center;
    justify-content: center;
  }

  .items-container {
    margin-right: 100px;
  }

  .word-box {
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

  .correct-word {
    border: none;
    background-color: transparent;
  }

  .wrong-word {
    background-color: red;
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