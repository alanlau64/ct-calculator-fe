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
  const playAudio = () => {
    audio.src = instructionAudioUrl.value;
    audio.play();
  }

  const actions = computed(() => {
    return props.task?.actions ? props.task.actions : []
  })
  const isCorrect = ref(props.task?.items ? new Array(props.task.items.length).fill(0) : []);
  const isWrong = ref(props.task?.items ? new Array(props.task.items.length).fill(false) : []);
  const columns = computed(() => props.task?.columns ? props.task.columns : 0);
  const rows = computed(() => props.task?.rows ? props.task.rows : 0);

  const curIdx = ref(0);
  const location = ref(0);

  const attempts = ref(0);
  const correctNum = ref(0);
  const ready = ref(false);

  const playPattern = async (replay: boolean) => {
    let intervId: NodeJS.Timer | undefined = undefined;
    const play = () => {
      try {
        location.value = actions.value[curIdx.value++].location + 1;
        if (curIdx.value > actions.value.length) {
          throw Error("out of range");
        }
      }
      catch {
        clearInterval(intervId);
        curIdx.value = correctNum.value;
        location.value = 0;
        intervId = undefined;
        ready.value = true;
      }
    }
    if (actions.value) {
      ready.value = false;
      if (replay)
        attempts.value++;
      if (!intervId) {
        play();
        intervId = setInterval(play, 1500);
      }
    }
  }

  onMounted(() => {playPattern(false)})

  const clickAnswer = (index: number) => {
    if (isCorrect.value[index] || finished.value || !ready.value)
      return;
    if (actions.value[correctNum.value].location === index) {
      attempts.value += 1;
      correctNum.value += 1;
      curIdx.value = correctNum.value;
      isCorrect.value[index] = correctNum.value;
    }
    else if (!isWrong.value[index]) {
      attempts.value += 1;
      isWrong.value[index] = true;
      ready.value = false;
      setTimeout(() => {
        ready.value = true;
        isWrong.value[index] = false;
      }, 1000);
    }

    if (correctNum.value === actions.value.length)
      done();
  }

  const done = () => {
    finished.value = true;
    finishText.value = `Correct, click <b>Next</b> to continue`;
  }

  const submit = () => {
    if (!props.task)
      return;
    emit('finish', props.taskType, props.taskLevel, correctNum.value / attempts.value);
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
    <button @click="playPattern(true)" :disabled="finished || !ready">Replay</button>
    <div class="items-container" :style="{'grid-template-columns': 'repeat(' + columns + ', 1fr)'}">
        <div 
        v-for="index in rows * columns" 
        class="item-container"
        :class="{ 'playing': location === index, 'is-correct': isCorrect[index-1], 'is-wrong': isWrong[index-1] }"
        :key="index"
        @click="clickAnswer(index-1)">
          {{ isCorrect[index-1] ? isCorrect[index-1] : "" }}
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
    background-color: #f8f8f8;
    width: 100px;
    height: 50px;
    margin: auto;
    text-align: center;
  }

  .playing {
    background-color: yellow;
  }

  .is-correct {
    background-color: springgreen;
    display: flex;
    justify-content: center;
    align-items: center;
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