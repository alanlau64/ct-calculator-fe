<script setup lang="ts">
  import { ref, computed, reactive, onMounted } from 'vue'

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

  const items = computed(() => {
    return props.task?.items ? shuffle(props.task.items) : []
  })
  const isCorrect = ref(props.task?.items ? new Array(props.task.items.length).fill(false) : []);
  const columns = computed(() => props.task?.columns ? props.task.columns : 0);
  const rows = computed(() => props.task?.rows ? props.task.rows : 0);

  const attempts = ref(0);
  const pairing2nd = ref(-1);
  const playing = ref(-1);
  const ready = ref(true);

  const clickAnswer = (index: number, soundPath: string) => {
    if (isCorrect.value[index] || pairing2nd.value === index || finished.value || !ready.value)
      return;
    playAudio(getResourceUrl(soundPath));
    if (pairing2nd.value === -1) {
      pairing2nd.value = index;
    }
    else {
      playing.value = index;
      attempts.value += 1;
      if (items.value[pairing2nd.value] !== items.value[index]) {
        ready.value = false;
        setTimeout(() => {
          pairing2nd.value = -1;
          playing.value = -1;
          ready.value = true;
        }, 2000);
      } else {
        isCorrect.value[pairing2nd.value] = true;
        isCorrect.value[playing.value] = true;
        pairing2nd.value = -1;
        playing.value = -1;
        if (isCorrect.value.every(x => x))
          done();
      }
    }
  }

  const done = () => {
    finished.value = true;
    finishText.value = `Correct, click <b>Next</b> to continue`;
  }

  const submit = () => {
    if (!props.task)
      return;
    emit('finish', props.taskType, props.taskLevel, Math.min(1, attempts.value / items.value.length));
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
    <div class="items-container" :style="{'grid-template-columns': 'repeat(' + columns + ', 1fr)'}">
        <div 
        v-for="(item, index) in items" 
        class="item-container"
        :class="{'correct': isCorrect[index], 'playing': playing === index || pairing2nd === index}"
        :key="index"
        @click="clickAnswer(index, item)">
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

  .items-container {
    margin-top: 20px;
    padding-left: 100px;
    padding-right: 100px;
    display: grid;
    gap: 10px;
  }

  .item-container {
    border: 2px solid #ccc;
    width: 100px;
    height: 100px;
    margin: auto;
    text-align: center;
  }

  .correct {
    border: 2px solid springgreen;
  }

  .playing {
    border: 2px solid yellow;
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