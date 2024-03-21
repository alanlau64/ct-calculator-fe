<script setup lang="ts">
  import { ref, computed, onMounted } from 'vue'

  const props = defineProps({
    task: Object,
    taskType: Number,
    taskLevel: Number,
    baseUrl: String
  });
  const emit = defineEmits(['finish']);

  const ready = ref(false);
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
    if (!props.task?.itemLetters || !props.task?.distractorLetters)
      return [];
    else {
      return shuffle([...props.task.itemLetters, ...props.task.distractorLetters]);
    }
  })

  const answer = computed(() => props.task?.itemLetters ? props.task.itemLetters : [])

  const attempts = ref(0);
  const dragging = ref(0);
  const isCorrectChoice = ref(choices.value ? new Array(choices.value.length).fill(false) : []);
  const isCorrectAnswer = ref(props.task?.itemLetters ? new Array(props.task.itemLetters.length).fill(false) : []);
  const isWrong = ref(choices.value ? new Array(choices.value.length).fill(false) : []);

  const onDrop = (boxId: number) => {
    if (isCorrectAnswer[boxId])
      return;
    const curDragging = dragging.value
    attempts.value++;
    if (answer.value[boxId].letter === choices.value[curDragging].letter) {
      isCorrectChoice.value[curDragging] = true;
      isCorrectAnswer.value[boxId] = true;
      dragging.value = 0;
      if (isCorrectAnswer.value.every(x => x === true))
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
      <div class="items-container">
        <div 
          v-for="(word, index) in choices"
          class="word-box"
          :class="{'wrong': isWrong[index], 'correct': isCorrectChoice[index]}"
          :draggable="!isWrong[index] && !isCorrectChoice[index] && !finished"
          @drag="dragging = index"
          @click="playAudio(getResourceUrl(word.soundPath))">
          {{ isCorrectChoice[index] ? "" : word.letter }}
        </div>
      </div>
      <img :src="getResourceUrl(props.task?.item?.imagePath)" style="width: 300px;"/>
      <div class="answer-container">
        <div
          v-for="(letter, index) in props.task?.itemLetters"
          class="answer-box"
          @dragover.prevent
          @drop.stop.prevent="onDrop(index)">
          {{ isCorrectAnswer[index] ? letter.letter : "" }}
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
    display: grid;
    gap: 10px;
    grid-template-columns: repeat(8, 1fr);
    margin-top: 30px;
    margin-bottom: 50px;
  }

  .word-box {
    border: 2px solid black;
    margin: auto;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 50px;
    height: 50px;
    font-size: 2em;
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
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
  }

  .answer-box {
    border: 1px solid #ccc;
    background-color: #f8f8f8;
    width: 50px;
    height: 50px;
    margin: auto;
    margin-bottom: 10px;
    margin-left: 5px;
    margin-right: 5px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 2em;
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