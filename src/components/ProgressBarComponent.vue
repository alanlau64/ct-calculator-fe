<script setup lang="ts">
  const props = defineProps(["texts", "landmark"])
</script>

<template>
  <div class="container">
    <hr class="line" />
    <div class="points-container">
      <div v-for="(text, index) in texts" :key="index" class="point" :class="{ 'highlight': index === landmark, 'next': index === landmark + 1 }">
        <div class="dot"></div>
        <div class="text">{{ text }}</div>
      </div>
    </div>
  </div>
</template>

<style>
  .container {
    position: relative;
    width: 80%;
    margin-bottom: 70px;
  }

  .line{
    width: 100%;
    border: none;
    border-top: 3px solid gray;
    margin: 0;
  }

  .points-container {
    display: flex;
    justify-content: space-between;
    position: absolute;
    width: 100%;
    top: -10px;
  }

  .point {
    text-align: center;
    position: relative;
    flex: 0 0 auto;
  }

  .dot {
    height: 20px;
    width: 20px;
    background-color: gray;
    border-radius: 50%;
    display: inline-block;
    position: absolute;
    top: 0px;
    left: 50%;
    transform: translateX(-50%);
  }

  .text {
    margin-top: 25px;
    width: 200px;
  }

  .highlight .dot {
    background-color: red;
  }

  .next .dot {
    background-color: blue;
  }
</style>