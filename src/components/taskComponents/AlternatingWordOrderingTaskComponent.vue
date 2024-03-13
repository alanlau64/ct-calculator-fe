<script setup lang="ts">
  import { ref, computed, reactive } from 'vue'

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

  const answer = computed(() => {
    return props.task?.matchingSymbol?.imagePath ? props.task.matchingSymbol.imagePath : ""
  })

  const audio = new Audio();
  const playAudio = () => {
    audio.src = instructionAudioUrl.value;
    audio.play();
  }

  const items = computed(() => {
    return props.task?.items ? props.task.items : []
  })
  const isCorrect = ref(props.task?.items ? new Array(props.task.items.length).fill(false) : []);
  const isWrong = ref(props.task?.items ? new Array(props.task.items.length).fill(false) : []);

  const attempts = ref(0);
  const correctNum = ref(0);

  const clickAnswer = (index: number) => {
    if (isCorrect.value[index] || finished.value)
      return;
    if (items.value[index].order === correctNum.value + 1) {
      attempts.value += 1;
      correctNum.value += 1;
      isCorrect.value[index] = true
      if (correctNum.value === items.value.length)
        finished.value = true
    }
    else if (!isWrong.value[index]) {
      attempts.value += 1;
      isWrong.value[index] = true;
      setTimeout(() => {
        isWrong.value[index] = false;
      }, 3000);
    }
  }

  const submit = () => {
    emit('finish', props.taskType, props.taskLevel, correctNum.value / attempts.value)
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
    <div class="items-container">
        <div 
        v-for="(item, index) in items" 
        class="item-container"
        :class="{ 'is-correct': isCorrect[index], 'is-wrong': isWrong[index] }"
        :key="index"
        @click="clickAnswer(index)">
          {{ item.name }}
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

  .answer-symbol-container {
    text-align: center;
  }

  .items-container {
    padding-left: 100px;
    padding-right: 100px;
    display: grid;
    gap: 10px;
    grid-template-columns: repeat(2, 1fr);
  }

  .item-container {
    border: 1px solid #ccc;
    background-color: #f8f8f8;
    width: 100px;
    margin: auto;
    text-align: center;
  }

  .is-correct {
    background-color: springgreen;
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