<script setup lang="ts">
  import { skills } from '../mapping.json'
  import { store } from '../store'
  import SkillComponent from '../components/SkillComponent.vue';

  const emit = defineEmits(['previous-screen', 'next-screen'])

  const selectSkill = (skillId: number) => {
    store.skill = skillId;
  }
</script>

<template>
  <div class="box-container">
    <SkillComponent 
      v-for="skill in skills" 
      :key="skill.id" 
      :skill="skill"
      :is-selected="store.skill === skill.id"
      @selected="selectSkill">
    </SkillComponent>
  </div>
  <div class="nextPage">
    <div>
      <button @click="emit('previous-screen')">Previous</button>
    </div>
    <div>
      <button @click="emit('next-screen')" :disabled="store.skill === 0">Next</button>
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