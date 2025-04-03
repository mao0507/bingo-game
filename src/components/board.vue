<template>
  <div class="bingo-board">
    <div class="grid-container">
      <div
        v-for="(number, index) in board"
        :key="index"
        class="grid-item"
        :class="{ matched: drawnNumbers.has(number) }"
        :data-index="index"
      >
        {{ number }}
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { defineProps } from 'vue';

defineProps<{
  board: number[];
  drawnNumbers: Set<number>;
}>();
</script>

<style scoped>
.bingo-board {
  width: 100%;
  margin: 0 auto;
}

.grid-container {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 5px;
  margin: 20px 0;
  animation: boardChange 0.5s ease-in-out;
}

.grid-item {
  width: 60px;
  height: 60px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f8f8f8;
  border: 2px solid #ddd;
  border-radius: 5px;
  transition: all 0.3s;
}

.grid-item.matched {
  background-color: #b2dfdb;
  border-color: #009688;
  animation: pulse 0.5s;
}

@keyframes pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
}

@keyframes boardChange {
  0% {
    transform: scale(0.95);
    opacity: 0.7;
  }
  50% {
    transform: scale(1.02);
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}
</style>
