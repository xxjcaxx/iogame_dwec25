export { generateFruitsRandomBoard, gameStep, detect4, transpose, reduceFind4, moveDown, delete4}

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

const reduceFind4 = (res, a, idx, arr) => {
  if (idx >= 3 && a !== 0) {
    const sub = [arr[idx - 3], arr[idx - 2], arr[idx - 1], a];
    sub.every(i => i === a) && res.push(idx - 3);
  }
  return res;
}

const detect4 = (fruitsBoard) => {
  // Aquesta funció detecta subarrays de 4 fruites iguals
  const horizontals = fruitsBoard.reduce(reduceFind4, []);
  const verticals = transpose(10, 12)(fruitsBoard).reduce(reduceFind4, []);
  return { horizontals, verticals };
}

const moveDown = (fruitsBoard) => {
  // Si baix d'una fruta no hi ha cap, cau
  // Retorna la quantitat de canvis que ha fet també
  let changes = 0;
  const newFruitsBoard = structuredClone(fruitsBoard);
  fruitsBoard.forEach((f, i) => {
    if (f !== 0 && fruitsBoard[i + 12] === 0) {
      newFruitsBoard[i] = 0;
      newFruitsBoard[i + 12] = f;
      changes += 1
    }
  });
  return { fruitsBoard: newFruitsBoard, changes }; 
}

const delete4 = (fruitsBoard) => {
  // Si troba 4 en línia amb les funcions anteriors els elimina posant-los a 0
  const { horizontals, verticals } = detect4(fruitsBoard);
  
  if (horizontals.length > 0 || verticals.length > 0) {
    const newFruitsBoard = structuredClone(fruitsBoard); 
    const positions = [...horizontals.map(h => ([h, h + 1, h + 2, h + 3])),
    ...verticals.map(v => [v, v + 12, v + 24, v + 36])].flat();
    console.log(positions);
    
    positions.forEach(pos => newFruitsBoard[pos] = 0);
    return { fruitsBoard: newFruitsBoard, changes: 1 };
  }
  return { fruitsBoard: fruitsBoard, changes: 0 }; // Si no troba retorna el mateix
}


function gameStep(fruitsBoard) {
  const { fruitsBoard: newFruitsBoard, changes } = moveDown(fruitsBoard);

  if (changes === 0) {
    const { fruitsBoard: newDeleteFruitsBoard, changes: deleteChanges } = delete4(newFruitsBoard);
    if (deleteChanges === 0) {
      return { fruitsBoard, changes: 0 };
    }
    return { fruitsBoard: newDeleteFruitsBoard, changes: deleteChanges };

  }
  return { fruitsBoard: newFruitsBoard, changes };
}



