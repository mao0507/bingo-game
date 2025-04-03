<template>
  <div class="ball-container" ref="ballContainer"></div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

const ballContainer = ref<HTMLDivElement | null>(null);

defineExpose({
  ballContainer,
  $el: ballContainer,
});
</script>

<style scoped>
.ball-container {
  position: relative;
  width: 100%;
  height: 100%;
  pointer-events: none;
  background-color: rgba(0, 0, 0, 0.05);
  border-radius: 10px;
  overflow: visible;
  z-index: 10;
}

:deep(.ball) {
  position: absolute;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  font-size: 14px;
  box-shadow: inset -2px -2px 6px rgba(0, 0, 0, 0.2), inset 2px 2px 6px rgba(255, 255, 255, 0.2);
  pointer-events: none;
  will-change: transform, left, top;
  z-index: 15;
}
</style>
