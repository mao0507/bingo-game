<template>
  <Layout />
</template>

<script lang="ts" setup>
import Layout from './layout.vue';
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: Arial, sans-serif;
  background-color: #f0f0f0;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

button {
  cursor: pointer;
}

button:active {
  transform: scale(0.95);
}
</style>
