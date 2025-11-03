export {generateFruitsRandomBoard, gameStep}

function generateFruitsRandomBoard(size) {
  let fruitsBoard = Array(size)
    .fill(0)
    .map((n, i) => (i >= size - 12 ? Math.floor(Math.random() * 10) : 0));
  return fruitsBoard;
}

function detect4(fruitsBoard){
    // Aquesta funció detecta subarrays de 4 fruites iguals
    
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


