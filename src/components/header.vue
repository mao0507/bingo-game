<template>
  <div class="header">
    <h1>賓果遊戲</h1>
    <div class="controls">
      <button id="startGame" @click="startGame">開始遊戲</button>
      <button id="changeBoard" @click="changeBoard">更換盤面</button>
    </div>
    <div class="ball-options">
      <button
        v-for="count in [30, 40, 50]"
        :key="count"
        class="ball-count-btn"
        :class="{ active: selectedBallCount === count }"
        :data-count="count"
        @click="setBallCount(count)"
      >
        {{ count }}球
      </button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

const selectedBallCount = ref(30);

const emit = defineEmits<{
  (e: 'startGame'): void;
  (e: 'changeBoard'): void;
  (e: 'setBallCount', count: number): void;
}>();

const startGame = () => {
  emit('startGame');
};

const changeBoard = () => {
  emit('changeBoard');
};

const setBallCount = (count: number) => {
  selectedBallCount.value = count;
  emit('setBallCount', count);
};
</script>

<style scoped>
.header {
  text-align: center;
  margin-bottom: 20px;
}

.controls {
  margin: 15px 0;
}

.ball-options {
  margin: 10px 0;
}

.ball-count-btn {
  padding: 8px 15px;
  margin: 0 5px;
  border: none;
  border-radius: 5px;
  background-color: #9e9e9e;
  color: white;
  cursor: pointer;
  transition: all 0.2s;
  transform: scale(1);
}

.ball-count-btn:hover {
  background-color: #757575;
}

.ball-count-btn.active {
  background-color: #2196f3;
}

.ball-count-btn.active:hover {
  background-color: #1976d2;
}

button {
  padding: 10px 20px;
  margin: 0 5px;
  border: none;
  border-radius: 5px;
  background-color: #4caf50;
  color: white;
  cursor: pointer;
  transition: all 0.3s;
  transform: scale(1);
}

button:hover {
  background-color: #45a049;
}

button:active {
  transform: scale(0.95);
}

#changeBoard {
  background-color: #2196f3;
}

#changeBoard:hover {
  background-color: #1976d2;
}
</style>
