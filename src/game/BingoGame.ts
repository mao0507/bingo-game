import { Engine, World, Bodies, Body, Events, Runner } from 'matter-js';
import { reactive } from 'vue';
import type { GameState, GameMessage } from '@/types/bingo';

export class BingoGame {
  private engine: Engine | null = null;
  private state: GameState;
  private message: GameMessage;
  private runner: Runner | null = null;

  constructor() {
    this.state = reactive({
      board: [],
      drawnNumbers: new Set<number>(),
      balls: new Map<Body, HTMLElement>(),
      maxBalls: 30,
      winningLines: 0,
      gameEndMessageShown: false,
    });

    this.message = reactive({
      text: '',
      isWin: false,
      show: false,
    });

    this.createBoard();
    this.init();
  }

  public initPhysics(container: HTMLElement): void {
    // 清除現有的球和停止舊引擎
    if (this.engine) {
      this.clearBalls();

      // 停止舊的運行器
      if (this.runner) {
        Runner.stop(this.runner);
        this.runner = null;
      }

      // 清理現有引擎的世界和事件
      Events.off(this.engine, 'afterUpdate');
      World.clear(this.engine.world, false);
      Engine.clear(this.engine);
    }

    const containerRect = container.getBoundingClientRect();

    // 初始化物理引擎 - 適當調整重力
    this.engine = Engine.create({
      gravity: { x: 0, y: 0.98 }, // 增加重力，使球體能明顯下落
    });

    // 創建邊界牆壁
    const walls = [
      Bodies.rectangle(
        containerRect.width / 2,
        containerRect.height + 15,
        containerRect.width,
        30,
        { isStatic: true, restitution: 0.6 },
      ), // 底部
      Bodies.rectangle(-15, containerRect.height / 2, 30, containerRect.height, {
        isStatic: true,
        restitution: 0.6,
      }), // 左側
      Bodies.rectangle(
        containerRect.width + 15,
        containerRect.height / 2,
        30,
        containerRect.height,
        { isStatic: true, restitution: 0.6 },
      ), // 右側
    ];

    World.add(this.engine.world, walls);

    // 開始運行物理引擎，設置高更新率
    this.runner = Runner.run(
      Runner.create({
        isFixed: true,
        delta: 1000 / 60, // 確保每秒60幀的更新速率
      }),
      this.engine,
    );

    // 全局位置更新事件
    Events.on(this.engine, 'afterUpdate', () => {
      this.state.balls.forEach((element, body) => {
        // 確保元素仍然在 DOM 中 (防止錯誤)
        if (element.isConnected) {
          // 更新球的位置
          element.style.left = `${body.position.x}px`;
          element.style.top = `${body.position.y}px`;

          // 添加旋轉效果
          const angle = body.angle * (180 / Math.PI);
          element.style.transform = `translate(-50%, -50%) rotate(${angle}deg)`;
        }
      });
    });

    // 輸出容器尺寸到控制台，幫助調試
    console.log('容器尺寸:', containerRect.width, containerRect.height);
  }

  private init(): void {
    this.setupEventListeners();
  }

  public createBoard(): void {
    const numbers = Array.from({ length: 70 }, (_, i) => i + 1);
    this.state.board = [];

    for (let i = 0; i < 25; i++) {
      const randomIndex = Math.floor(Math.random() * numbers.length);
      const number = numbers.splice(randomIndex, 1)[0];
      this.state.board.push(number);
    }
  }

  private setupEventListeners(): void {
    // 事件監聽器將在 Vue 組件中設置
  }

  private createBall(number: number, container: HTMLElement): Body {
    if (!this.engine || !this.engine.world) {
      console.error('物理引擎未初始化！');
      throw new Error('物理引擎未初始化');
    }

    const containerRect = container.getBoundingClientRect();

    // 創建DOM元素
    const ballElement = document.createElement('div');
    ballElement.className = 'ball';
    ballElement.textContent = number.toString();

    // 輸出調試信息
    console.log('創建球:', number, '容器尺寸:', containerRect.width, containerRect.height);

    // 隨機顏色
    const colors = [
      '#FF6B6B',
      '#4ECDC4',
      '#45B7D1',
      '#96CEB4',
      '#FFEEAD',
      '#D4A5A5',
      '#FF9F43',
      '#A3CB38',
      '#786FA6',
      '#F8C291',
      '#63CDDA',
      '#EA8685',
      '#778BEB',
      '#F19066',
      '#E77F67',
      '#CF6A87',
      '#786FA6',
      '#FDA7DF',
      '#4834D4',
      '#6AB04C',
    ];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    ballElement.style.backgroundColor = randomColor;

    // 確保樣式被正確設置
    ballElement.style.position = 'absolute';
    ballElement.style.width = '30px';
    ballElement.style.height = '30px';
    ballElement.style.borderRadius = '50%';
    ballElement.style.display = 'flex';
    ballElement.style.alignItems = 'center';
    ballElement.style.justifyContent = 'center';
    ballElement.style.color = 'white';
    ballElement.style.fontWeight = 'bold';
    ballElement.style.fontSize = '14px';
    ballElement.style.boxShadow =
      'inset -2px -2px 6px rgba(0,0,0,0.2), inset 2px 2px 6px rgba(255,255,255,0.2)';
    ballElement.style.pointerEvents = 'none';
    ballElement.style.zIndex = '15';

    // 將球添加到容器
    container.appendChild(ballElement);

    // 創建物理球體
    const radius = 15;
    const randomDensity = 0.001 + Math.random() * 0.003;
    const randomRestitution = 0.5 + Math.random() * 0.4;

    // 從容器頂部隨機位置生成
    const x = Math.random() * (containerRect.width - 40) + 20;
    const y = 10; // 從容器頂部開始

    // 設置初始位置
    ballElement.style.left = `${x}px`;
    ballElement.style.top = `${y}px`;
    ballElement.style.transform = 'translate(-50%, -50%)';

    // 創建物理球
    const ball = Bodies.circle(x, y, radius, {
      label: 'ball-' + number, // 添加唯一標籤
      restitution: randomRestitution,
      friction: 0.05, // 稍微增加摩擦力
      density: randomDensity,
      frictionAir: 0.001, // 降低空氣阻力
      slop: 0.05, // 增加碰撞容許誤差
      isStatic: false, // 確保不是靜態物體
    });

    // 添加到物理世界
    World.add(this.engine.world, ball);
    this.state.balls.set(ball, ballElement);

    // 立即觸發一次位置更新
    ballElement.style.left = `${ball.position.x}px`;
    ballElement.style.top = `${ball.position.y}px`;

    return ball;
  }

  public drawNumber(container: HTMLElement): boolean | null {
    if (this.state.drawnNumbers.size >= this.state.maxBalls) {
      const lines = this.checkWin();
      if (!this.state.gameEndMessageShown) {
        this.showMessage(
          lines > 0
            ? `${this.state.maxBalls}球遊戲結束！恭喜完成 ${lines} 條連線！`
            : `${this.state.maxBalls}球遊戲結束！很可惜，沒有連線。`,
          lines > 0,
        );
        this.state.gameEndMessageShown = true;
      }
      return null;
    }

    // 確保容器位置是最新的
    const containerRect = container.getBoundingClientRect();
    console.log('球容器當前尺寸:', containerRect.width, containerRect.height);

    // 一次開出3-5顆球
    const ballsToDrawCount = Math.floor(Math.random() * 3) + 3;
    const remainingBalls = this.state.maxBalls - this.state.drawnNumbers.size;
    const actualBallsToDrawCount = Math.min(ballsToDrawCount, remainingBalls);

    const availableNumbers = Array.from({ length: 70 }, (_, i) => i + 1).filter(
      (n) => !this.state.drawnNumbers.has(n),
    );

    if (availableNumbers.length === 0) return null;

    // 預先抽取所有號碼
    const drawnNumbers: number[] = [];
    for (let i = 0; i < actualBallsToDrawCount; i++) {
      const randomIndex = Math.floor(Math.random() * availableNumbers.length);
      const drawnNumber = availableNumbers.splice(randomIndex, 1)[0];
      drawnNumbers.push(drawnNumber);
    }

    // 依序延遲創建球
    drawnNumbers.forEach((drawnNumber, index) => {
      setTimeout(() => {
        this.state.drawnNumbers.add(drawnNumber);

        // 創建物理球
        const ball = this.createBall(drawnNumber, container);

        // 給予隨機初始速度
        Body.setVelocity(ball, {
          x: (Math.random() - 0.5) * 2, // 較小的水平速度
          y: Math.random() * 2 + 1, // 增加向下的初始速度
        });

        // 較小的角速度
        Body.setAngularVelocity(ball, (Math.random() - 0.5) * 0.1);

        // 檢查配對
        if (this.state.board.includes(drawnNumber)) {
          const newLines = this.checkWin();
          if (newLines > this.state.winningLines) {
            this.showMessage(`太棒了！新增 ${newLines - this.state.winningLines} 條連線！`, true);
            this.state.winningLines = newLines;
          }
        }
      }, index * 300); // 增加間隔時間
    });

    return true;
  }

  public startGame(container: HTMLElement): void {
    this.state.winningLines = 0;
    this.state.gameEndMessageShown = false;
    this.state.drawnNumbers.clear();

    // 重新初始化物理引擎
    this.initPhysics(container);

    // 確保容器在正確的位置
    console.log('遊戲容器狀態:', container.getBoundingClientRect());

    const interval = setInterval(() => {
      const number = this.drawNumber(container);
      if (!number) {
        clearInterval(interval);
      }
    }, 1500);
  }

  public changeBoard(): void {
    this.state.drawnNumbers.clear();
    this.clearBalls();
    this.createBoard();
  }

  private clearBalls(): void {
    if (this.engine && this.engine.world) {
      this.state.balls.forEach((element, body) => {
        // 確保球體還在物理世界中
        if (body && this.engine && this.engine.world.bodies.includes(body)) {
          World.remove(this.engine.world, body);
        }
        // 確保元素還在 DOM 中
        if (element && element.parentNode) {
          element.remove();
        }
      });
      this.state.balls.clear();
    }
  }

  private checkWin(): number {
    const size = 5;
    let lines = 0;

    // 檢查橫行
    for (let i = 0; i < size; i++) {
      let matched = true;
      for (let j = 0; j < size; j++) {
        const number = this.state.board[i * size + j];
        if (!this.state.drawnNumbers.has(number)) {
          matched = false;
          break;
        }
      }
      if (matched) lines++;
    }

    // 檢查直行
    for (let i = 0; i < size; i++) {
      let matched = true;
      for (let j = 0; j < size; j++) {
        const number = this.state.board[j * size + i];
        if (!this.state.drawnNumbers.has(number)) {
          matched = false;
          break;
        }
      }
      if (matched) lines++;
    }

    // 檢查對角線
    let diagonal1 = true;
    let diagonal2 = true;
    for (let i = 0; i < size; i++) {
      const number1 = this.state.board[i * size + i];
      const number2 = this.state.board[i * size + (size - 1 - i)];
      if (!this.state.drawnNumbers.has(number1)) diagonal1 = false;
      if (!this.state.drawnNumbers.has(number2)) diagonal2 = false;
    }
    if (diagonal1) lines++;
    if (diagonal2) lines++;

    return lines;
  }

  public showMessage(text: string, isWin: boolean): void {
    this.message.text = text;
    this.message.isWin = isWin;
    this.message.show = true;

    setTimeout(() => {
      this.message.show = false;
    }, 3000);
  }

  public getState(): GameState {
    return this.state;
  }

  public getMessage(): GameMessage {
    return this.message;
  }

  public setMaxBalls(count: number): void {
    this.state.maxBalls = count;
  }
}
