import {describe, expect, test, vi } from "vitest";

import * as game from "../src/gameLogic"


describe("generateFruitsRandomBoard", () => {

  test("retorna un array del tamaño correcto", () => {
    const result = game.generateFruitsRandomBoard(20);
    expect(result).toHaveLength(20);
  });

  test("los primeros elementos antes de size-12 son 0", () => {
    const size = 20;
    const result = game.generateFruitsRandomBoard(size);
    expect(result.slice(0, size - 12).every(n => n === 0)).toBe(true);
  });

  test("los últimos 12 elementos son números enteros entre 0 y 15", () => {
    const size = 20;
    const result = game.generateFruitsRandomBoard(size);
    const last12 = result.slice(-12);
    expect(last12.every(n => Number.isInteger(n) && n >= 0 && n < 16)).toBe(true);
  });

  test("usa Math.random para generar los últimos 12 valores", () => {
    const spy = vi.spyOn(Math, "random").mockReturnValue(0.5);
    const size = 20;
    const result = game.generateFruitsRandomBoard(size);
    spy.mockRestore();

    const last12 = result.slice(-12);
    // Si Math.random = 0.5 → Math.floor(0.5 * 16) = 8
    expect(last12.every(n => n === 8)).toBe(true);
  });

  test("si size < 12, todos los valores son aleatorios", () => {
    const spy = vi.spyOn(Math, "random").mockReturnValue(0.25);
    const size = 8;
    const result = game.generateFruitsRandomBoard(size);
    spy.mockRestore();

    // 0.25 * 16 = 4
    expect(result.every(n => n === 4)).toBe(true);
  });

});

describe("transpose", () => {

  test("traspone correctamente una matriz 2x3", () => {
    const rows = 2;
    const cols = 3;
    const arr = [1, 2, 3, 4, 5, 6]; // [[1,2,3],[4,5,6]]

    const result = game.transpose(rows, cols)(arr);
    expect(result).toEqual([1, 4, 2, 5, 3, 6]);
  });

  test("traspone correctamente una matriz 3x2", () => {
    const rows = 3;
    const cols = 2;
    const arr = [1, 2, 3, 4, 5, 6]; // [[1,2],[3,4],[5,6]]

    const result = game.transpose(rows, cols)(arr);
    expect(result).toEqual([1, 3, 5, 2, 4, 6]);
  });

  test("una matriz cuadrada (3x3) retorna correctamente", () => {
    const rows = 3;
    const cols = 3;
    const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9];

    const result = game.transpose(rows, cols)(arr);
    expect(result).toEqual([1, 4, 7, 2, 5, 8, 3, 6, 9]);
  });

  test("funciona con matriz 1xN y Nx1", () => {
    expect(game.transpose(1, 4)([10, 20, 30, 40])).toEqual([10, 20, 30, 40]);
    expect(game.transpose(4, 1)([10, 20, 30, 40])).toEqual([10, 20, 30, 40]);
  });


});


describe("reduceFind4", () => {

  test("detecta una secuencia simple de 4 elementos iguales", () => {
    const arr = [1, 1, 1, 1];
    const result = arr.reduce(game.reduceFind4, []);
    expect(result).toEqual([0]);
  });

  test("detecta múltiples secuencias de 4 iguales", () => {
    const arr = [1,1,1,1,2,2,2,2,3,3];
    const result = arr.reduce(game.reduceFind4, []);
    expect(result).toEqual([0, 4]);
  });

  test("no devuelve nada si no hay 4 iguales consecutivos", () => {
    const arr = [1,1,2,1,1,1,2];
    const result = arr.reduce(game.reduceFind4, []);
    expect(result).toEqual([]);
  });

  test("funciona con cadenas también", () => {
    const arr = ["a","a","a","a","b","b","b","b"];
    const result = arr.reduce(game.reduceFind4, []);
    expect(result).toEqual([0, 4]);
  });

  test("si hay más de 4 iguales seguidos, marca todos los inicios posibles de 4 en fila", () => {
    const arr = [1,1,1,1,1,1];
    const result = arr.reduce(game.reduceFind4, []);
    // posibles subgrupos de 4: [0-3], [1-4], [2-5]
    expect(result).toEqual([0,1,2]);
  });

});

describe("gameStep", () => {

  test("devuelve un nuevo array (no muta el original)", () => {
    const board = [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                   0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    const result = game.gameStep(board);

    expect(result.fruitsBoard).not.toBe(board);
    expect(board[0]).toBe(1); // el original no cambia
  });

  test("mueve una fruta hacia abajo si la celda 12 posiciones abajo está vacía", () => {
    const board = [
      5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
    ];

    const result = game.gameStep(board);
    expect(result.fruitsBoard[0]).toBe(0);
    expect(result.fruitsBoard[12]).toBe(5);
  });

  test("no mueve una fruta si debajo hay otra fruta", () => {
    const board = [
      7, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
    ];

    const result = game.gameStep(board);
    expect(result.fruitsBoard).toEqual(board); // no cambia
  });

  test("mueve varias frutas si pueden bajar", () => {
    const board = [
      1, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
    ];

    const result = game.gameStep(board).fruitsBoard;
    expect(result[0]).toBe(0);
    expect(result[4]).toBe(0);
    expect(result[12]).toBe(1);
    expect(result[16]).toBe(2);
  });

  test("no falla si el array es más pequeño que 12 elementos", () => {
    const board = [1, 2, 3, 0, 4, 5];
    const result = game.gameStep(board).fruitsBoard;
    expect(result).toEqual(board); // no hay posiciones 12 abajo
  });

});


describe("detect4", () => {

  test("devuelve un objeto con horizontals y verticals", () => {
    const board = [1,1,1,1,2,2,2,2];
    const result = game.detect4(board);
    expect(result).toHaveProperty("horizontals");
    expect(result).toHaveProperty("verticals");
  });

  test("detecta secuencias horizontales de 4 iguales", () => {
    const board = [1,1,1,1,2,3,3,3,3];
    const result = game.detect4(board);
    expect(result.horizontals).toContain(0);
    expect(result.horizontals).toContain(5);
  });

  test("no detecta horizontales si no hay 4 iguales consecutivos", () => {
    const board = [1,1,2,1,1,3,3,4];
    const result = game.detect4(board);
    expect(result.horizontals).toEqual([]);
  });

  test("funciona con verticales",()=>{
    const board = Array(120).fill(0).map((_,ix)=>ix);
    board[1] = 1;
    board[13] = 1;
    board[25] = 1;
    board[37] = 1;
    const result = game.detect4(board);
    expect(result.verticals).toEqual([10]);
  });

});
