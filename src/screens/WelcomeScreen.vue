<script setup lang="ts">
  import { ref } from 'vue';

  const emit = defineEmits(['next-screen'])
  const message = ref('Welcome!')
</script>

<template>
<div class="title">
  <h1> {{ message }} </h1>
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
</style>