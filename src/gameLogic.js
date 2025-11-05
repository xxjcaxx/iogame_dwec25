export {generateFruitsRandomBoard, gameStep, detect4, transpose, reduceFind4}

function generateFruitsRandomBoard(size) {
  let fruitsBoard = Array(size)
    .fill(0)
    .map((n, i) => (i >= size - 12 ? Math.floor(Math.random() * 16) : 0));
  return fruitsBoard;
}

const transpose = (rows, cols) => (arr) => {
  return Array.from({ length: cols * rows }, (_, idx) => {
    const col = Math.floor(idx / rows);
    const row = idx % rows;
    return arr[row * cols + col];
  });
}

const reduceFind4 = (res,a,idx,arr)=>{
      if(idx >= 3){
         const sub = [arr[idx-3],arr[idx-2],arr[idx-1],a];
         sub.every(i=> i===a) && res.push(idx-3);
      }
      return res;
    }

function detect4(fruitsBoard){
    // Aquesta funció detecta subarrays de 4 fruites iguals
    const horizontals = fruitsBoard.reduce(reduceFind4,[]);
    const verticals = transpose(10,12)(fruitsBoard).reduce(reduceFind4,[]); 
    return {horizontals,verticals};
}


function gameStep(fruitsBoard) {
  const newFruitsBoard = structuredClone(fruitsBoard);
  let changes = 0;
  fruitsBoard.forEach((f, i) => {
    if (f !== 0 && fruitsBoard[i + 12] === 0) {
      newFruitsBoard[i] = 0;
      newFruitsBoard[i + 12] = f;
      changes+=1
    }
  });
  return {fruitsBoard: newFruitsBoard, changes};
}



