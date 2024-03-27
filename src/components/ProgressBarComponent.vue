<script setup lang="ts">
  const props = defineProps(["texts", "landmark"])
</script>

<template>
  <div class="container">
    <hr class="line" />
    <div class="points-container">
      <div v-for="(text, index) in texts" :key="index" class="point" :class="{ 'highlight': index === landmark, 'next': index === landmark + 1 }">
        <div class="highlight-text">
          <span v-if="index === landmark">Current Landmark</span>
          <span v-else-if="index === landmark + 1">Target Landmark</span>
        </div>
        <div class="arrow">
          <span v-if="index === landmark || index === landmark + 1">↓</span>
        </div>
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
    margin-top: 50px;
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
    top: -50px;
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
    top: 40px;
    left: 50%;
    transform: translateX(-50%);
  }

  .highlight-text {
    height: 1em;
    margin-bottom: 5px;
  }

  .arrow {
    height: 1em;
    margin-bottom: 20px;
  }

  .text {
    margin-top: 30px;
    width: 200px;
  }

  .highlight .dot {
    background-color: red;
  }

  .next .dot {
    background-color: blue;
  }
</style>