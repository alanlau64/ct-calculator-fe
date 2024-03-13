<script setup lang="ts">
  import { ref } from 'vue'

  const props = defineProps(['skill', 'isSelected']);
  const emit = defineEmits(['selected'])
  const imgPath = ref(`https://ct-calculator-fe.s3.us-east-2.amazonaws.com/assets/skills/skill${props.skill.id}.png`);
  const boxGroupName = 'skillBoxGroup';

  const select = () => {
    emit('selected', props.skill?.id)
  }
</script>

<template>
  <div class="box" :class="{ 'selected': isSelected }" @click="select">
    <img :src="imgPath" :alt="skill.description" class="skillImg"/>
    <p> {{ skill.description }} </p>
  </div>
</template>

<style>
  .box {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    border: 1px solid #000;
    padding: 10px;
  }

  .selected {
    border: 3px solid blue;
    background-color: #e6f0ff;
  }

  .skillImg {
    width: 20%;
  }
</style>