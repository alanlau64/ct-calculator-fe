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

  const getResourceUrl = (src: string) => {
    return props.baseUrl ? props.baseUrl + src : "";
  }

  const audio = new Audio();
  const playAudio = () => {
    audio.src = instructionAudioUrl.value;
    audio.play();
  }

  const stimulus = computed(() => props.task?.stimulus ? props.task.stimulus : []);
  const answer = computed(() => props.task?.answers ? props.task.answers : []);
  const isCorrect = ref(false);
  const isWrong = ref(false);
  const flyOut = ref(false);
  const flyIn = ref(false);
  const imgPath = ref(getResourceUrl(stimulus.value[0].imagePath));

  const curIdx = ref(0);

  const attempts = ref(0);
  const correctNum = ref(0);
  const start = ref(true);

  const playPattern = async () => {
    start.value = false;
    let intervId: NodeJS.Timer | undefined = undefined;
    const play = () => {
      flyOut.value = true;
      if (answer.value.includes(curIdx.value) && !isCorrect)
        isWrong.value = true;
      setTimeout(() => {
        curIdx.value++;
        isCorrect.value = false;
        isWrong.value = false;
        if (curIdx.value >= stimulus.value.length) {
          finished.value = true;
          done();
          clearInterval(intervId);
          intervId = null;
          return;
        }
        imgPath.value = getResourceUrl(stimulus.value[curIdx.value].imagePath);
        flyOut.value = false;
        flyIn.value = true;
        console.log(curIdx.value, stimulus.value.length)

        setTimeout(() => {
          flyIn.value = false;
        }, 300);
      }, 300);
        
    }
    if (stimulus.value) {
      if (!intervId) {
        play();
        intervId = setInterval(play, 2000);
      }
    }
  }

  const clickAnswer = (index: number) => {
    console.log('clicked');
    if (isCorrect.value || isWrong.value)
      return;
    if (answer.value.includes(index)) {
      attempts.value += 1;
      correctNum.value += 1;
      isCorrect.value = true;
    }
    else if (!isWrong.value) {
      attempts.value += 1;
      isWrong.value = true;
    }
  }

  const done = () => {
    finished.value = true;
    finishText.value = `Finished, click <b>Next</b> to continue`;
  }

  const submit = () => {
    if (!props.task)
      return;
    let acc: number;
    if (attempts.value < answer.value.length)
      acc = correctNum.value / answer.value.length;
    else
      acc = correctNum.value / attempts.value
    emit('finish', props.taskType, props.taskLevel, acc);
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
    <div class="item-container" :class="{'is-correct': isCorrect, 'is-wrong': isWrong, 'fly-out': flyOut, 'fly-in': flyIn}">
        <img :src="imgPath" @click="clickAnswer(curIdx)"/>
    </div>
    <button v-if="start" @click="playPattern">Start</button>
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

  .item-container {
    margin: auto;
    margin-top: 20px;
    margin-bottom: 20px;
    border: 2px solid #ccc;
    width: 204px;
    height: 204px;
    transition: transform 0.3s, opacity 0.3s;
    transform: translateX(0%);
  }

  img {
    width: 200px;
    height: 200px;
  }

  .is-correct {
    border: 2px solid green;
  }

  .is-wrong {
    border: 2px solid red;
  }

  .fly-out {
    transform: translateX(-150%);
    opacity: 0;
  }

  .fly-in {
    transform: translateX(0%);
    opacity: 1;
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