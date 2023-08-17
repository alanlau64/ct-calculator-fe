<template>
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
  .nextPage {
      padding-top: 20px;
      display: block;
      text-align: center;
    }
</style>