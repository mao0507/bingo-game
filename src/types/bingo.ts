import type { Body } from 'matter-js';

export interface Ball {
  body: Body;
  element: HTMLElement;
}

export interface GameState {
  board: number[];
  drawnNumbers: Set<number>;
  balls: Map<Body, HTMLElement>;
  maxBalls: number;
  winningLines: number;
  gameEndMessageShown: boolean;
}

export interface GameMessage {
  text: string;
  isWin: boolean;
  show: boolean;
}
