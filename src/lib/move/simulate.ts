import {
  extractSNotation,
  squareNotation,
  SquareNotation,
} from "@/lib/AN/Square";
import Board, { initBoard } from "@/lib/Board";
import { PieveMovKindResolver } from "@/lib/move/generators/pieces";
import {
  PieceMovements,
  PieceMoveStrategy,
  PieceMoveType,
} from "@/lib/move/Piece";
import Piece, { createPiece, PieceKind } from "@/lib/Piece";

export interface Move {
  to: SquareNotation;
  caputres?: SquareNotation;
}

export function* simulateMove(
  piece: Piece,
  from: SquareNotation,
  board: Board,
  currentTurn: number
): Generator<Move> {
  const moves = PieceMovements[piece.kind];
  for (const move of moves) {
    const generator = PieveMovKindResolver[move.type];

    for (const squares of generator(from, {
      isWhite: piece.isWhite,
      hasMoved:
        piece.kind === PieceKind.Pawn && piece.firstMoveAtTurn !== undefined,
    })) {
      for (const s of squares) {
        const boardPiece = board[s];
        const hasPiece = boardPiece !== null;
        const isOwnPiece = boardPiece?.isWhite === piece.isWhite;
        const isTrace = move.strategy === PieceMoveStrategy.Trace;

        if (!hasPiece) {
          if (move.type === PieceMoveType.Fork) continue;
          else if (move.type === PieceMoveType.EnPassant) {
            const [, r] = extractSNotation(from);
            const [f] = extractSNotation(s);
            const ps = squareNotation(f, r);
            const p = board[ps];

            if (
              p?.kind === PieceKind.Pawn &&
              p?.isWhite !== piece.isWhite &&
              p.firstMoveAtTurn === currentTurn - 1
            ) {
              yield { to: s, caputres: ps };
            }
          } else yield { to: s };
          continue;
        }

        if (isOwnPiece) {
          if (isTrace) break;
          continue;
        }

        if (move.isPassive) {
          if (isTrace) break;
          continue;
        }

        yield { to: s, caputres: s };
        if (isTrace) break;
      }
    }
  }
}

if (import.meta.vitest) {
  const { test, expect } = import.meta.vitest;

  test("e4 pawn push", () => {
    const ret = simulateMove(
      createPiece(PieceKind.Pawn, true),
      "e2",
      initBoard(),
      0
    );
    const actual = [...ret];
    const expected: typeof actual = [{ to: "e4" }, { to: "e3" }];
    expect(actual).toStrictEqual(expect.arrayContaining(expected));
  });

  test("e4 pawn push has moved", () => {
    const ret = simulateMove(
      {
        kind: PieceKind.Pawn,
        isWhite: true,
        firstMoveAtTurn: 1,
      },
      "e2",
      initBoard(),
      0
    );
    const actual = [...ret];
    const expected: typeof actual = [{ to: "e3" }];
    expect(actual).toStrictEqual(expect.arrayContaining(expected));
  });

  test("queen stuck", () => {
    const ret = simulateMove(
      {
        kind: PieceKind.Queen,
        isWhite: true,
      },
      "d1",
      initBoard(),
      0
    );
    const actual = [...ret];
    const expected: typeof actual = [];
    expect(actual).toStrictEqual(expected);
  });

  test("knight boxed in but can move", () => {
    const ret = simulateMove(
      {
        kind: PieceKind.Knight,
        isWhite: true,
      },
      "b1",
      initBoard(),
      0
    );
    const actual = [...ret];
    const expected: typeof actual = [{ to: "a3" }, { to: "c3" }];
    expect(actual).toStrictEqual(expect.arrayContaining(expected));
  });

  test("queen comes out", () => {
    const ret = simulateMove(
      {
        kind: PieceKind.Queen,
        isWhite: true,
      },
      "d2",
      initBoard(),
      0
    );
    const actual = [...ret];
    const expected: typeof actual = [
      { to: "c3" },
      { to: "b4" },
      { to: "a5" },
      { to: "d3" },
      { to: "d4" },
      { to: "d5" },
      { to: "d6" },
      { to: "d7", caputres: "d7" },
      { to: "e3" },
      { to: "f4" },
      { to: "g5" },
      { to: "h6" },
    ];
    expect(actual).toStrictEqual(expect.arrayContaining(expected));
  });
}
