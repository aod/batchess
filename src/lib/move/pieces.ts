import { extractSNotation, squareNotation, SquareNotation } from "../AN/Square";
import { PieceMoveType } from "./Piece";
import {
  diags,
  diagsBL,
  diagsBR,
  diagsTL,
  diagsTR,
  horiz,
  horizL,
  horizR,
  vert,
  vertB,
  vertT,
} from "./squares";

export type PieceMoveGeneratorFn = (
  square: SquareNotation
) => Generator<SquareNotation>;

export type PieceMoveGeneratorPawnFn = (
  square: SquareNotation,
  hasMoved?: boolean
) => Generator<SquareNotation>;

export type PieceMovesGenerators = {
  [K in PieceMoveType]: K extends PieceMoveType.Pawn
    ? PieceMoveGeneratorPawnFn
    : PieceMoveGeneratorFn;
};

export const PieveMovKindResolver: Readonly<PieceMovesGenerators> = {
  [PieceMoveType.King]: function* (square) {
    yield* maybeNext(diagsTL(square));
    yield* maybeNext(vertT(square));
    yield* maybeNext(diagsTR(square));
    yield* maybeNext(horizR(square));
    yield* maybeNext(diagsBR(square));
    yield* maybeNext(vertB(square));
    yield* maybeNext(diagsBL(square));
    yield* maybeNext(horizL(square));
  },
  [PieceMoveType.Pawn]: function* (square, hasMoved) {
    const vt = vertT(square);
    yield* maybeNext(vt);
    if (!hasMoved) yield* maybeNext(vt);
    yield* maybeNext(diagsTL(square));
    yield* maybeNext(diagsTR(square));
  },
  [PieceMoveType.Knight]: function* (square) {
    yield* ifMoveable(square, 2, 1);
    yield* ifMoveable(square, 2, -1);
    yield* ifMoveable(square, -2, -1);
    yield* ifMoveable(square, -2, 1);
    yield* ifMoveable(square, -1, 2);
    yield* ifMoveable(square, 1, 2);
    yield* ifMoveable(square, -1, -2);
    yield* ifMoveable(square, 1, -2);
  },
  [PieceMoveType.Horizontal]: function* (square) {
    yield* horiz(square);
  },
  [PieceMoveType.Vertical]: function* (square) {
    yield* vert(square);
  },
  [PieceMoveType.Diagonal]: function* (square) {
    yield* diags(square);
  },
};

function* maybeNext<T>(it: Iterator<T>) {
  const current = it.next();
  if (!current.done) yield current.value;
}

function skip<T>(it: Iterator<T>, n = 1) {
  for (let i = 0; i < n; i++) it.next();
  return it;
}

function* both<T, U, V>(a: Iterator<T>, b: Iterator<U>, fn: (a: T, b: U) => V) {
  const [curA, curB] = [a.next(), b.next()];
  if (!curA.done && !curB.done) yield fn(curA.value, curB.value);
}

// function* map<T, U>(it: Iterator<T>, fn: (res: T) => U) {
//   const current = it.next();
//   if (!current.done) {
//     const ret = fn(current.value);
//     if (ret) yield ret;
//   }
// }

function* ifMoveable(
  start: SquareNotation,
  fileOffset: number,
  rankeOffset: number
) {
  const horizIt = fileOffset > 0 ? horizR(start) : horizL(start);
  skip(horizIt, Math.abs(fileOffset) - 1);
  const horizCurr = horizIt.next();
  if (horizCurr.done) return;

  const vertIt = rankeOffset > 0 ? vertT(start) : vertB(start);
  skip(vertIt, Math.abs(rankeOffset) - 1);
  const vertCurr = vertIt.next();
  if (vertCurr.done) return;

  yield squareNotation(
    extractSNotation(horizCurr.value)[0],
    extractSNotation(vertCurr.value)[1]
  );
}

if (import.meta.vitest) {
  const { it, expect } = import.meta.vitest;

  it("should pass", () => {
    const tor = PieveMovKindResolver[PieceMoveType.Pawn]("b2", false);
    const actual = [...tor];
    const expected = ["a3", "b3", "b4", "c3"];
    expect(actual.sort()).toStrictEqual(expected.sort());
  });

  it("should give correct square moves for move type knight f3", () => {
    const tor = PieveMovKindResolver[PieceMoveType.Knight]("f3");
    const actual = [...tor];
    const expected = ["h2", "h4", "d2", "d4", "e5", "g5", "g1", "e1"];
    expect(actual.sort()).toStrictEqual(expected.sort());
  });

  it("should give correct square moves for move type knight h8", () => {
    const tor = PieveMovKindResolver[PieceMoveType.Knight]("h8");
    const actual = [...tor];
    const expected = ["g6", "f7"];
    expect(actual.sort()).toStrictEqual(expected.sort());
  });
}
