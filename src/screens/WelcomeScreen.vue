<script lang="ts">
export default {
  data () {
    return {
      message: "Welcome"
    }
  }
}
</script>

<template>
<div class="title">
  <h1> {{ message }} </h1>
  <button @click="$emit('next-screen')">Start</button>
</div>
</template>

<style>
.title {
  padding-top: 5%;
  margin: auto;
  width: 50%;
  text-align: center;
}
</style>