<template>
  <div class="game-container">
    <Header @startGame="startGame" @changeBoard="changeBoard" @setBallCount="setBallCount" />
    <Board :board="gameState.board" :drawnNumbers="gameState.drawnNumbers" />
    <div class="number-history">
      <Ball ref="ballRef" />
    </div>
    <Message :show="gameMessage.show" :is-win="gameMessage.isWin" :text="gameMessage.text" />
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted, watch } from 'vue';
import Header from '@/components/header.vue';
import Board from '@/components/board.vue';
import Ball from '@/components/ball.vue';
import Message from '@/components/message.vue';
import { BingoGame } from '@/game/BingoGame';
import type { GameState, GameMessage } from '@/types/bingo';

// 遊戲實例和狀態
const game = ref(new BingoGame());
const ballRef = ref();

// 遊戲狀態
const gameState = reactive<GameState>({
  board: [],
  drawnNumbers: new Set<number>(),
  balls: new Map(),
  maxBalls: 30,
  winningLines: 0,
  gameEndMessageShown: false,
});

// 遊戲消息
const gameMessage = reactive<GameMessage>({
  text: '',
  isWin: false,
  show: false,
});

// 初始化遊戲
onMounted(() => {
  // 初始化遊戲狀態
  if (game.value) {
    const state = game.value.getState();
    Object.assign(gameState, state);

    // 初始化消息
    const message = game.value.getMessage();
    Object.assign(gameMessage, message);

    // 初始化物理引擎
    if (ballRef.value && ballRef.value.$el) {
      game.value.initPhysics(ballRef.value.$el);
    }
  }
});

// 監聽遊戲狀態變化
watch(
  () => game.value,
  () => {
    if (game.value) {
      // 更新遊戲狀態
      const state = game.value.getState();
      Object.assign(gameState, state);

      // 更新消息
      const message = game.value.getMessage();
      Object.assign(gameMessage, message);
    }
  },
  { deep: true },
);

// 初始化遊戲後設定狀態更新間隔
setInterval(() => {
  if (game.value) {
    // 更新遊戲狀態
    const state = game.value.getState();
    Object.assign(gameState, state);

    // 更新消息
    const message = game.value.getMessage();
    Object.assign(gameMessage, message);
  }
}, 100);

// 遊戲控制函數
const startGame = () => {
  if (game.value && ballRef.value) {
    const container = ballRef.value.$el;
    if (container) {
      game.value.startGame(container);

      // 強制更新狀態
      const state = game.value.getState();
      Object.assign(gameState, state);
    }
  }
};

const changeBoard = () => {
  if (game.value) {
    game.value.changeBoard();
    // 更新遊戲狀態
    const state = game.value.getState();
    Object.assign(gameState, state);
  }
};

const setBallCount = (count: number) => {
  if (game.value) {
    gameState.maxBalls = count;
    // 通知遊戲實例更新最大球數
    game.value.setMaxBalls(count);
  }
};
</script>

<style>
.game-container {
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  max-width: 800px;
  margin: 0 auto;
  position: relative;
  overflow: visible;
}

.number-history {
  margin-top: 20px;
  text-align: center;
  position: relative;
  height: 300px;
  overflow: visible;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  background-color: rgba(0, 0, 0, 0.03);
  z-index: 1;
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: Arial, sans-serif;
  background-color: #f0f0f0;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  overflow-x: hidden;
}
</style>
