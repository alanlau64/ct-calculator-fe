<script setup lang="ts">
  import { ref, watch } from 'vue'
  import { store } from '../store'

  const props = defineProps(['skill']);
  const imgPath = ref("./src/assets/skills/skill" + props.skill.id + ".png");
  const boxGroupName = 'skillBoxGroup';

</script>

<template>
  <div class="box">
    <img :src="imgPath" :alt="skill.description" class="skillImg"/>
    <p> {{ skill.description }} </p>
    <input 
      type="radio" 
      :value="props.skill.id" 
      v-model="store.skill"
      :name="boxGroupName" 
      :disabled="skill.id !== 8"/>
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

  .skillImg {
    width: 20%;
  }
</style>