<template>
  <div
    v-if="show"
    class="game-message"
    :class="{ win: isWin, 'fade-out': isFadingOut }"
    ref="messageEl"
  >
    {{ text }}
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue';

const props = defineProps<{
  show: boolean;
  isWin: boolean;
  text: string;
}>();

const messageEl = ref<HTMLElement | null>(null);
const isFadingOut = ref(false);

// 監聽顯示狀態變化，添加淡出動畫
watch(
  () => props.show,
  (newValue, oldValue) => {
    if (newValue === false && oldValue === true) {
      isFadingOut.value = true;
      setTimeout(() => {
        isFadingOut.value = false;
      }, 500);
    }
  },
);
</script>

<style scoped>
.game-message {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 20px 40px;
  background-color: rgba(0, 0, 0, 0.8);
  color: white;
  border-radius: 10px;
  font-size: 18px;
  z-index: 1000;
  animation: messageIn 0.3s ease-out;
}

.game-message.win {
  background-color: rgba(76, 175, 80, 0.9);
}

.game-message.fade-out {
  animation: messageOut 0.5s ease-in forwards;
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

@keyframes messageIn {
  from {
    opacity: 0;
    transform: translate(-50%, -30%);
  }
  to {
    opacity: 1;
    transform: translate(-50%, -50%);
  }
}

@keyframes messageOut {
  from {
    opacity: 1;
    transform: translate(-50%, -50%);
  }
  to {
    opacity: 0;
    transform: translate(-50%, -70%);
  }
}
</style>
