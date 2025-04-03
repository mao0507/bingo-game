<template>
  <div class="number-history">
    <div class="ball-container">
      <div v-for="number in Array.from(drawnNumbers).reverse()" :key="number" class="ball">
        {{ number }}
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
defineProps<{
  drawnNumbers: Set<number>;
}>();
</script>

<style scoped>
.number-history {
  margin-top: 20px;
  text-align: center;
  position: relative;
  height: 300px;
  overflow: hidden;
}

.ball-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  background-color: rgba(0, 0, 0, 0.05);
  border-radius: 10px;
}

.ball {
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
  transform: translate(-50%, -50%);
  pointer-events: none;
}
</style>
