<script setup lang="ts">
  import { skills } from '../mapping.json'
  import SkillComponent from '../components/SkillComponent.vue';
</script>

<template>
  <div class="box-container">
    <SkillComponent 
      v-for="skill in skills" 
      :key="skill.id" 
      :skill="skill">
    </SkillComponent>
  </div>
  <div class="nextPage">
    <div>
      <button @click="$emit('previous-screen')">Previous</button>
    </div>
    <div>
      <button @click="$emit('next-screen')">Next</button>
    </div>
  </div>
</template>

<style>
  .box-container {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 10px;
  }
  .nextPage {
    padding-top: 20px;
    display: block;
    text-align: center;
  }
</style>