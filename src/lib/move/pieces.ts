import { SquareNotation } from "../AN/Square";
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
    // TODO
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

if (import.meta.vitest) {
  const { it, expect } = import.meta.vitest;

  it("should pass", () => {
    const tor = PieveMovKindResolver[PieceMoveType.Pawn]("b2", false);
    const actual = [...tor];
    const expected = ["a3", "b3", "b4", "c3"];
    expect(actual.sort()).toStrictEqual(expected.sort());
  });
}
