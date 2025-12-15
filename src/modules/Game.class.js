/* eslint-disable indent */
'use strict';

/**
 * This class represents the game.
 * Now it has a basic structure, that is needed for testing.
 * Feel free to add more props and methods if needed.
 */
class Game {
  /**
   * Creates a new game instance.
   *
   * @param {number[][]} initialState
   * The initial state of the board.
   * @default
   * [[0, 0, 0, 0],
   *  [0, 0, 0, 0],
   *  [0, 0, 0, 0],
   *  [0, 0, 0, 0]]
   *
   * If passed, the board will be initialized with the provided
   * initial state.
   */
  constructor(initialState) {
    this.board = initialState
      ? structuredClone(initialState)
      : [
          [0, 0, 0, 0],
          [0, 0, 0, 0],
          [0, 0, 0, 0],
          [0, 0, 0, 0],
        ];
    this.score = 0;
    this.gameStatus = 'idle';

    this.initialState = initialState
      ? structuredClone(initialState)
      : [
          [0, 0, 0, 0],
          [0, 0, 0, 0],
          [0, 0, 0, 0],
          [0, 0, 0, 0],
        ];
  }

  moveLeft() {
    if (this.gameStatus !== 'playing') {
      return;
    }

    const prevBoard = structuredClone(this.board);

    for (let i = 0; i < 4; i++) {
      this.board[i] = this.#proccessRowLeft(this.board[i]);
    }

    if (JSON.stringify(prevBoard) !== JSON.stringify(this.board)) {
      this.spawnRandomTile();
    }

    if (this.board.some((row) => row.includes(2048))) {
      this.gameStatus = 'win';
    }

    if (this.gameStatus !== 'win' && this.checkLose()) {
      this.gameStatus = 'lose';
    }
  }
  #proccessRowLeft(row) {
    const newRow = row.filter((num) => num !== 0);

    for (let i = 0; i < newRow.length; i++) {
      if (newRow[i] === newRow[i + 1]) {
        newRow[i] *= 2;
        newRow[i + 1] = 0;
        this.score += newRow[i];
        i++;
      }
    }

    const filteredRow = newRow.filter((num) => num !== 0);

    while (filteredRow.length < 4) {
      filteredRow.push(0);
    }

    return filteredRow;
  }
  moveRight() {
    if (this.gameStatus !== 'playing') {
      return;
    }

    const prevBoard = structuredClone(this.board);

    for (let i = 0; i < 4; i++) {
      const reversedRow = [...this.board[i]].reverse();
      const proccessedRow = this.#proccessRowLeft(reversedRow);

      this.board[i] = proccessedRow.reverse();
    }

    if (JSON.stringify(prevBoard) !== JSON.stringify(this.board)) {
      this.spawnRandomTile();
    }

    if (this.board.some((row) => row.includes(2048))) {
      this.gameStatus = 'win';
    }

    if (this.gameStatus !== 'win' && this.checkLose()) {
      this.gameStatus = 'lose';
    }
  }
  moveUp() {
    if (this.gameStatus !== 'playing') {
      return;
    }

    const prevBoard = structuredClone(this.board);

    for (let i = 0; i < 4; i++) {
      const column = [];

      for (let j = 0; j < 4; j++) {
        column.push(this.board[j][i]);
      }

      const proccessedColumn = this.#proccessRowLeft(column);

      for (let j = 0; j < 4; j++) {
        this.board[j][i] = proccessedColumn[j];
      }
    }

    if (JSON.stringify(prevBoard) !== JSON.stringify(this.board)) {
      this.spawnRandomTile();
    }

    if (this.board.some((row) => row.includes(2048))) {
      this.gameStatus = 'win';
    }

    if (this.gameStatus !== 'win' && this.checkLose()) {
      this.gameStatus = 'lose';
    }
  }
  moveDown() {
    if (this.gameStatus !== 'playing') {
      return;
    }

    const prevBoard = structuredClone(this.board);

    for (let i = 0; i < 4; i++) {
      const column = [];

      for (let j = 0; j < 4; j++) {
        column.push(this.board[j][i]);
      }

      const reversedColumn = [...column].reverse();
      const proccessedColumn = this.#proccessRowLeft(reversedColumn);

      const finalColumn = proccessedColumn.reverse();

      for (let j = 0; j < 4; j++) {
        this.board[j][i] = finalColumn[j];
      }
    }

    if (JSON.stringify(prevBoard) !== JSON.stringify(this.board)) {
      this.spawnRandomTile();
    }

    if (this.board.some((row) => row.includes(2048))) {
      this.gameStatus = 'win';
    }

    if (this.gameStatus !== 'win' && this.checkLose()) {
      this.gameStatus = 'lose';
    }
  }
  checkLose() {
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (this.board[i][j] === 0) {
          return false;
        }
      }
    }

    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (this.board[i][j] === this.board[i][j + 1]) {
          return false;
        }

        if (this.board[i][j] === this.board[i + 1]?.[j]) {
          return false;
        }
      }
    }

    return true;
  }
  getScore() {
    return this.score;
  }
  getState() {
    return this.board;
  }
  getStatus() {
    return this.gameStatus;
  }
  start() {
    if (this.gameStatus === 'idle') {
      this.gameStatus = 'playing';
      this.spawnRandomTile();
      this.spawnRandomTile();
    }
  }
  spawnRandomTile() {
    const emptyCells = [];

    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (this.board[i][j] === 0) {
          emptyCells.push({ i, j });
        }
      }
    }

    if (emptyCells.length === 0) {
      return;
    }

    const randomIndex = Math.floor(Math.random() * emptyCells.length);
    const { i: row, j: column } = emptyCells[randomIndex];

    this.board[row][column] = Math.random() < 0.9 ? 2 : 4;
  }
  restart() {
    this.board = structuredClone(this.initialState);
    this.score = 0;
    this.gameStatus = 'idle';
  }
}

module.exports = Game;
