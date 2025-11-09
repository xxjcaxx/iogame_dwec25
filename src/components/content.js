import { generateFruitsRandomBoard, gameStep } from "../gameLogic";
import { getData } from "../services/supaservice";
import { compose } from "../functionals";
import { BehaviorSubject, from, fromEvent, interval, map, withLatestFrom, merge, filter, tap, distinct, distinctUntilChanged } from "rxjs";

export { renderContent };




///////////// Funcions totalment pures


function update(fruitsBoard, action) {
  if (action.type === "CLICK_CELL") {
    const newBoard = structuredClone(fruitsBoard);
    const column = action.position % 12;
    newBoard[column] = Math.floor(Math.random() * 16);
    return newBoard;
  }
  if (action.type === "STEP") {
    const { fruitsBoard: newFruitsBoard, changes } = gameStep(fruitsBoard);
    if (changes > 0) {
      return newFruitsBoard;
    }
    return fruitsBoard;
  }
}


function renderTable(fruitCellsMap) {
  const template = `
        <div class="container board-wrapper">
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

function handleClick(event) {
  if (event.target.tagName === "DIV" && event.target.dataset.position) {
    const action = {
      type: "CLICK_CELL",
      position: parseInt(event.target.dataset.position),
    };
    return action;
  }
  return null;
}





function renderContent() {
  ////////// Estat Global controlat (closure d'aquesta funció)

  const fruitsBoardSubject = new BehaviorSubject([]);

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

  const fruitsBoardInit = generateFruitsRandomBoard(120);
   fruitsBoardSubject.next(fruitsBoardInit);
   const fruitCellsMap = renderCells(fruitsBoardInit);
   const divContainer = renderTable(fruitCellsMap);

 // Els observables
  const click$ = fromEvent(divContainer, "click").pipe(map((event) => handleClick(event)));
  const gameLoop$ = gameLoop();
  const gameLoopEventsMerged$ = merge(click$, gameLoop$);

  // implementació del bucle:
  let i =0;
  gameLoopEventsMerged$.pipe(
    filter(action => action !== null),   // filter(Boolean)
    withLatestFrom(fruitsBoardSubject),
    map(([action, fruitsBoard]) => update(fruitsBoard, action)),
    distinctUntilChanged(),
     tap(fruitsBoard => console.log(fruitsBoard, i++))
  ).subscribe(fruitsBoardSubject);

  // Refrescar a cada pas
  fruitsBoardSubject.subscribe(fruitsBoard => refreshCells(fruitsBoard, fruitCellsMap));
  //getData('games').then(data => console.log(data));

  return divContainer;
}
