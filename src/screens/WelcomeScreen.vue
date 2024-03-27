<script setup lang="ts">
  import { ref } from 'vue';

  const emit = defineEmits(['next-screen'])
  const message = ref('Welcome!')
</script>

<template>
  <div class="title">
    <h1> {{ message }} </h1>
    <span>For best performance, please use a computer to visit the site</span>
  </div>
  <div class="next-page">
    <button @click="emit('next-screen')">Start</button>
  </div>
</template>

<style scoped>
  .title {
    padding-top: 5%;
    margin: auto;
    width: 50%;
    text-align: center;
  }

  .next-page {
      padding-top: 20px;
      display: block;
      text-align: center;
  }
</style>