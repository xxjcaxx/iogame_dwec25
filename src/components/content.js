import { generateFruitsRandomBoard, gameStep, updateGame } from "../gameLogic";
import { getData, getGames, updateData } from "../services/supaservice";
import { compose } from "../functionals";
import { BehaviorSubject, from, fromEvent, interval, map, withLatestFrom, merge, filter, tap, distinct, distinctUntilChanged, debounceTime } from "rxjs";

import { fruitsImgs } from "./fruits";

export { renderContent };




///////////// Funcions totalment pures


function renderTable(fruitCellsMap) {
  const template = `
        <div class="container board-wrapper">
          <div id="gameData" class="gameData"></div>
          <div id="board" class="board">
          </div>
        </div>
    `;
  let wrapper = document.createElement("div");
  wrapper.innerHTML = template;
  const divContainer = wrapper.firstElementChild;
  const divBoard = divContainer.querySelector("#board");
  divBoard.replaceChildren(...fruitCellsMap.values());
  return divContainer;
}



function renderCells(fruitsBoard) {
  const fruitCellsMap = new Map();
  fruitsBoard.forEach((f, i) => {
    const divCellHTML = `<div 
      class="cell" 
      data-fruit="${f}" 
      data-position="${i}">
        ${f}
      </div>`;
    const divCellWrapper = document.createElement("div");
    divCellWrapper.innerHTML = divCellHTML;
    fruitCellsMap.set(i, divCellWrapper.firstElementChild);
  });
  return fruitCellsMap;
}

function gameLoop() {
  return interval(100).pipe(
    map(() => {
      const action = { type: "STEP" };
      return action;
    }))
}

function handleClick(event, nextFruit) {
  if (event.target.tagName === "DIV" && event.target.dataset.position) {
    const action = {
      type: "CLICK_CELL",
      position: parseInt(event.target.dataset.position),
      fruit: nextFruit
    };
    return action;
  }
  return null;
}

const renderNextFruits = (nextFruits) => {
  const divNextFruits = document.createElement("div");
  divNextFruits.classList.add("nextFruitsContainer")
  divNextFruits.innerHTML = nextFruits.map(
    f => `<div class="nextFruit" data-fruit="${f}">
    <img src="${fruitsImgs["fruit" + (f)]}">
    </div>`
  ).join('')
  return divNextFruits;
}

const moveNextFruits = (nextFruits) => {
  const currentNextFruits = [...nextFruits.getValue()];
  currentNextFruits.pop();
  nextFruits.next([1 + Math.floor(Math.random() * 15), ...currentNextFruits]);
}


function renderContent() {
  ////////// Estat Global controlat (closure d'aquesta funció)

  const fruitsBoardSubject = new BehaviorSubject([]);
  const divContainer = document.createElement("div");

  ///// Funcions amb efectes col·laterals controlats

  // Efecte col·lateral: Modificació del DOM
  function refreshCells(fruitsBoard, fruitCellsMap) {
    fruitsBoard.forEach((f, i) => {
      if (fruitCellsMap.get(i).textContent != f) {
        fruitCellsMap.get(i).textContent = f;
        fruitCellsMap.get(i).dataset.fruit = f;
      }
    });
  }


  // Codi principal (main)
  async function initGame(idGame) {
    console.log("Iniciant joc per a l'usuari: ", idGame);
    // Carregar dades del joc des de Supabase
    const dataGame = await getData('games', { id: idGame });
    console.log("Dades del joc carregades:", dataGame);

    // Inicialitzar l'estat del joc
    const fruitsBoardInit = dataGame[0].game_state;
    fruitsBoardSubject.next(fruitsBoardInit);
    const fruitCellsMap = renderCells(fruitsBoardInit);
    divContainer.replaceChildren(renderTable(fruitCellsMap));

    // Els observables
    const nextFruits = new BehaviorSubject(Array.from({ length: 5 }, () => 1 + Math.floor(Math.random() * 15)));

    const click$ = fromEvent(divContainer, "click").pipe(
      withLatestFrom(nextFruits),
      map(([event, next]) => handleClick(event, next[4])),
      tap(() => { moveNextFruits(nextFruits) })
    );
    const gameLoop$ = gameLoop();
    const gameLoopEventsMerged$ = merge(click$, gameLoop$);

    // implementació del bucle:
    let i = 0;
    gameLoopEventsMerged$.pipe(
      filter(action => action !== null),   // filter(Boolean)
      withLatestFrom(fruitsBoardSubject),
      map(([action, fruitsBoard]) => updateGame(fruitsBoard, action)),
      distinctUntilChanged(),
      tap(fruitsBoard => console.log(fruitsBoard, i++))
    ).subscribe(fruitsBoardSubject);

    // Refrescar a cada pas
    fruitsBoardSubject.subscribe(fruitsBoard => refreshCells(fruitsBoard, fruitCellsMap));

    // Guardar dades a Supabase
    fruitsBoardSubject.pipe(debounceTime(200)).subscribe(fruitsBoard => {
      updateData('games',idGame,{game_state:fruitsBoard});
    });


    nextFruits.subscribe(nextFruits => {
      divContainer.querySelector("#gameData").replaceChildren(renderNextFruits(nextFruits));
    });
  }

  divContainer.innerHTML = `<game-gameslist></game-gameslist>`;

  divContainer.addEventListener('gameSelected', (event) => {
    const gameId = event.detail.gameId;
    initGame(gameId);
  });

  //getData('games').then(data => console.log(data));

  return divContainer;
}
