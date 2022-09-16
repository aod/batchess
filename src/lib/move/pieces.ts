import { extractSNotation, squareNotation, SquareNotation } from "../AN/Square";
import { PieceMoveType } from "./Piece";
import {
  diagsBL,
  diagsBR,
  diagsTL,
  diagsTR,
  horizL,
  horizR,
  vertB,
  vertT,
} from "./squares";

export type PieceMoveGeneratorFn = (
  square: SquareNotation,
  isWhite?: boolean
) => Generator<SquareNotation[]>;

export type PieceMoveGeneratorPawnFn = (
  square: SquareNotation,
  isWhite?: boolean,
  hasMoved?: boolean
) => Generator<SquareNotation[]>;

export type PieceMovesGenerators = {
  [K in PieceMoveType]: K extends PieceMoveType.Pawn
    ? PieceMoveGeneratorPawnFn
    : PieceMoveGeneratorFn;
};

export const PieveMovKindResolver: Readonly<PieceMovesGenerators> = {
  [PieceMoveType.King]: function* (square) {
    yield* collect(
      maybeNext(diagsTL(square)),
      maybeNext(vertT(square)),
      maybeNext(diagsTR(square)),
      maybeNext(horizR(square)),
      maybeNext(diagsBR(square)),
      maybeNext(vertB(square)),
      maybeNext(diagsBL(square)),
      maybeNext(horizL(square))
    );
  },
  [PieceMoveType.Pawn]: function* (square, isWhite, hasMoved) {
    const vert = isWhite ? vertT(square) : vertB(square);
    yield* collect(maybeNext(vert), hasMoved ? none() : maybeNext(vert));
  },
  [PieceMoveType.Knight]: function* (square) {
    yield* collect(
      ifMoveable(square, 2, 1),
      ifMoveable(square, 2, -1),
      ifMoveable(square, -2, -1),
      ifMoveable(square, -2, 1),
      ifMoveable(square, -1, 2),
      ifMoveable(square, 1, 2),
      ifMoveable(square, -1, -2),
      ifMoveable(square, 1, -2)
    );
  },
  [PieceMoveType.Horizontal]: function* (square) {
    yield* collect(horizR(square));
    yield* collect(horizL(square));
  },
  [PieceMoveType.Vertical]: function* (square) {
    yield* collect(vertT(square));
    yield* collect(vertB(square));
  },
  [PieceMoveType.Diagonal]: function* (square) {
    yield* collect(diagsTL(square));
    yield* collect(diagsTR(square));
    yield* collect(diagsBR(square));
    yield* collect(diagsBL(square));
  },
};

function* collect<T>(...grators: Generator<T>[]) {
  const result = [];
  for (const grator of grators) {
    result.push(...grator);
  }
  if (result.length) yield result;
}

function* none() {}

function* maybeNext<T>(it: Iterator<T>) {
  const current = it.next();
  if (!current.done) yield current.value;
}

function skip<T>(it: Iterator<T>, n = 1) {
  for (let i = 0; i < n; i++) it.next();
  return it;
}

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
    const tor = PieveMovKindResolver[PieceMoveType.Pawn]("b2", true, false);
    const actual = [...tor];
    const expected = [["b3", "b4"]];
    expect(actual.sort()).toStrictEqual(expected.sort());
  });

  it("should give correct square moves for move type knight f3", () => {
    const tor = PieveMovKindResolver[PieceMoveType.Knight]("f3");
    const actual = [...tor];
    const expected = [
      ["h2", "h4", "d2", "d4", "e5", "g5", "g1", "e1"].sort(),
    ].sort();
    expect(actual.map((xs) => xs.sort()).sort()).toStrictEqual(expected);
  });

  it("should give correct square moves for move type knight h8", () => {
    const tor = PieveMovKindResolver[PieceMoveType.Knight]("h8");
    const actual = [...tor];
    const expected = [["g6", "f7"].sort()].sort();
    expect(actual.map((xs) => xs.sort()).sort()).toStrictEqual(expected);
  });

  it("should give correct square moves for move type vertical diagonal", () => {
    const tor = PieveMovKindResolver[PieceMoveType.Diagonal]("d1");
    const actual = [...tor];
    const expected = [
      ["c2", "b3", "a4"].sort(),
      ["e2", "f3", "g4", "h5"].sort(),
    ].sort();

    expect(actual.map((xs) => xs.sort()).sort()).toStrictEqual(expected);
  });
}
