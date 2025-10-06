export {renderContent}

function generateFruitsRandomBoard(size) {
  const fruitsBoard = Array(size)
    .fill(0)
    .map((n,i)=> i>=size-12 ? Math.floor(Math.random()*10) : 0);
 /* for(let i=size-12; i<size; i++){
    fruitsBoard[i]=Math.floor(Math.random()*10);
  }*/
  return fruitsBoard;
}

const fruitCellsMap = new Map();

function renderContent(){

  const fruitsBoard = generateFruitsRandomBoard(120);
    const template = `

<div class="container board-wrapper">
  <div id="board" class="board">
  ${
    ''
   /* fruitsBoard.map((f,i)=>`<div 
      class="cell" 
      data-fruit="${f}" 
      data-position="${i}">
        ${f}
      </div>`).join('')*/
  }
  </div>
</div>
    `;

    let wrapper = document.createElement('div');
    wrapper.innerHTML = template;
    const divContainer = wrapper.firstElementChild;
    const divBoard = divContainer.querySelector('#board');
    fruitsBoard.forEach((f,i)=>{
      const divCellHTML = `<div 
      class="cell" 
      data-fruit="${f}" 
      data-position="${i}">
        ${f}
      </div>`;
      const divCellWrapper = document.createElement('div');
      divCellWrapper.innerHTML = divCellHTML;
      fruitCellsMap.set(divCellWrapper.firstElementChild,{fruit: f,position: i});
      divBoard.append(divCellWrapper.firstElementChild);
    });

    return divContainer;

}