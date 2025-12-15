'use strict';

const Game = require('../modules/Game.class');
const game = new Game();

const buttonEl = document.querySelector('.button.start');
const scoreEl = document.querySelector('.game-score');
const cellsEl = Array.from(document.querySelectorAll('.field-cell'));
const messageStartEl = document.querySelector('.message.message-start');
const messageWinEl = document.querySelector('.message.message-win');
const messageLoseEl = document.querySelector('.message.message-lose');

function render(prevState = null) {
  const state = game.getState();
  const score = game.getScore();
  const gameStatus = game.getStatus();

  scoreEl.textContent = `${score}`;

  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      const cellValue = state[i][j];
      const cellEl = cellsEl[i * 4 + j];

      cellEl.className = 'field-cell';
      cellEl.textContent = '';

      if (cellValue !== 0) {
        cellEl.textContent = cellValue;
        cellEl.classList.add(`field-cell--${cellValue}`);

        if (prevState && prevState[i][j] === 0) {
          cellEl.classList.add('spawn');

          const handleAnimationEnd = () => {
            cellEl.classList.remove('spawn');
            cellEl.removeEventListener('animationend', handleAnimationEnd);
          };

          cellEl.addEventListener('animationend', handleAnimationEnd);
        }

        if (
          prevState &&
          prevState[i][j] !== 0 &&
          cellValue !== 0 &&
          cellValue > prevState[i][j]
        ) {
          cellEl.classList.add('merge');

          const handleAnimationEnd = () => {
            cellEl.classList.remove('merge');
            cellEl.removeEventListener('animationend', handleAnimationEnd);
          };

          cellEl.addEventListener('animationend', handleAnimationEnd);
        }
      }
    }
  }

  messageStartEl.classList.toggle('hidden', gameStatus !== 'idle');
  messageWinEl.classList.toggle('hidden', gameStatus !== 'win');
  messageLoseEl.classList.toggle('hidden', gameStatus !== 'lose');

  if (gameStatus === 'idle') {
    buttonEl.textContent = 'Start';
    buttonEl.classList.add('start');
    buttonEl.classList.remove('restart');
  } else {
    buttonEl.textContent = 'Restart';
    buttonEl.classList.add('restart');
    buttonEl.classList.remove('start');
  }
}

function handleStartRestart() {
  const gameStatus = game.getStatus();

  if (gameStatus === 'idle') {
    game.start();
    render();
  } else {
    game.restart();
    render();
  }
}

buttonEl.addEventListener('click', handleStartRestart);

function handleKeyDown(ev) {
  const key = ev.key;

  if (
    key !== 'ArrowUp' &&
    key !== 'ArrowDown' &&
    key !== 'ArrowLeft' &&
    key !== 'ArrowRight'
  ) {
    return;
  }

  ev.preventDefault();

  const prevState = structuredClone(game.getState());

  if (key === 'ArrowUp') {
    game.moveUp();
  }

  if (key === 'ArrowDown') {
    game.moveDown();
  }

  if (key === 'ArrowLeft') {
    game.moveLeft();
  }

  if (key === 'ArrowRight') {
    game.moveRight();
  }

  render(prevState);
}

document.addEventListener('keydown', handleKeyDown);
