export { renderContent };




///////////// Funcions totalment pures

function generateFruitsRandomBoard(size) {
  let fruitsBoard = Array(size)
    .fill(0)
    .map((n, i) => (i >= size - 12 ? Math.floor(Math.random() * 10) : 0));
  return fruitsBoard;
}

function gameStep(fruitsBoard) {
  const newFruitsBoard = structuredClone(fruitsBoard);
  fruitsBoard.forEach((f, i) => {
    if (f !== 0 && fruitsBoard[i + 12] === 0) {
      newFruitsBoard[i] = 0;
      newFruitsBoard[i + 12] = f;
    }
  });
  return newFruitsBoard;
}

function update(fruitsBoard, action) {
  if (action.type === "CLICK_CELL") {
    const newBoard = structuredClone(fruitsBoard);
    const column = action.position % 12;
    newBoard[column] = Math.floor(Math.random() * 10);
    return newBoard;
  }
  if (action.type === "STEP") {
    return gameStep(fruitsBoard);
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




function renderContent() {
  ////////// Estat Global controlat (closure d'aquesta funció)

  let fruitsBoard = [];

  ///// Funcions amb efectes col·laterals controlats

  // Efecte col·lateral: Modificació del DOM
  function refreshCells(fruitsBoard, fruitCellsMap) {
    fruitsBoard.forEach((f, i) => {
      if (fruitCellsMap.get(i).textContent != f) {
        fruitCellsMap.get(i).textContent = f;
      }
    });
  }

  // Efecte col·lateral: Modificació de variable global i cridada a modificació del DOM
  function gameLoop(fruitCellsMap) {
    setInterval(() => {
      const action = { type: "STEP" };
      fruitsBoard = update(fruitsBoard, action);
      refreshCells(fruitsBoard, fruitCellsMap);
      console.log(JSON.stringify(fruitsBoard));
    }, 1000);
  }

  // Efecte: Atenció d'esdeveniment, modificació de variable global
  function handleClick() {
    return function (event) {
      if (event.target.tagName === "DIV" && event.target.dataset.position) {
        const action = {
          type: "CLICK_CELL",
          position: parseInt(event.target.dataset.position),
        };
        fruitsBoard = update(fruitsBoard, action);
      }
    };
  }

  // Codi principal (main)

  fruitsBoard = generateFruitsRandomBoard(120);
  const fruitCellsMap = renderCells(fruitsBoard);
  const divContainer = renderTable(fruitCellsMap);
  divContainer.addEventListener("click", handleClick());
  gameLoop(fruitCellsMap);

  return divContainer;
}
