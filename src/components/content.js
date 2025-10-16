export { renderContent };

function generateFruitsRandomBoard(size) {
  const fruitsBoard = Array(size)
    .fill(0)
    .map((n, i) => (i >= size - 12 ? Math.floor(Math.random() * 10) : 0));
  return fruitsBoard;
}

function handleClick(fruitsBoard, fruitCellsMap) {
  return function (event) {
    if (event.target.tagName === "DIV" && event.target.dataset.position) {
      let n = Math.floor(Math.random() * 10);

      let column = event.target.dataset.position%12;
       fruitsBoard[column] = n;

      //fruitsBoard[event.target.dataset.position] = n;
      refreshCells(fruitsBoard, fruitCellsMap);
    }
  };
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

function refreshCells(fruitsBoard, fruitCellsMap) {
  fruitsBoard.forEach((f, i) => {
    if (fruitCellsMap.get(i).textContent != f) {
      fruitCellsMap.get(i).textContent = f;
    }
  });
}

function renderContent() {
  const fruitsBoard = generateFruitsRandomBoard(120);
  const fruitCellsMap = renderCells(fruitsBoard);

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
  divBoard.addEventListener("click", handleClick(fruitsBoard, fruitCellsMap));
  return divContainer;
}
