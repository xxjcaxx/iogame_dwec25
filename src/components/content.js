export {renderContent}

function renderContent(){
  const fruitsBoard = Array(120).fill(0).map((_,i)=>i)
    return `
<div class="container board-wrapper">
  <div class="board">
  ${
    fruitsBoard.map(f=>`<div class="cell">${f}</div>`).join('')
  }
  
   
  </div>
</div>
    `;
}