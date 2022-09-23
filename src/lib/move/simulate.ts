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
  isCapture?: boolean;
  changes: [SquareNotation, SquareNotation | null][];
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
      hasMoved: piece.firstMoveAtTurn !== undefined,
    })) {
      for (const s of squares) {
        const boardPiece = board[s];
        const hasPiece = boardPiece !== null;
        const isOwnPiece = boardPiece?.isWhite === piece.isWhite;

        // TODO: Refactor
        if (move.type === PieceMoveType.Castling) {
          if (piece.firstMoveAtTurn !== undefined) continue;
          if (board[s] !== null) continue;

          const [file, rank] = extractSNotation(s);
          const rightMostPieceS = squareNotation("h", rank);
          const rightMostPiece = board[rightMostPieceS];
          const leftMostPieceS = squareNotation("a", rank);
          const leftMostPiece = board[leftMostPieceS];

          if (
            file === "g" &&
            board[squareNotation("f", rank)] === null &&
            rightMostPiece?.kind === PieceKind.Rook &&
            rightMostPiece.firstMoveAtTurn === undefined
          ) {
            yield {
              to: s,
              changes: [
                [s, from],
                [from, null],
                [squareNotation("f", rank), rightMostPieceS],
                [rightMostPieceS, null],
              ],
            };
          } else if (
            file === "c" &&
            board[squareNotation("d", rank)] === null &&
            board[squareNotation("b", rank)] === null &&
            leftMostPiece?.kind === PieceKind.Rook &&
            leftMostPiece.firstMoveAtTurn === undefined
          ) {
            yield {
              to: s,
              changes: [
                [s, from],
                [from, null],
                [squareNotation("d", rank), leftMostPieceS],
                [leftMostPieceS, null],
              ],
            };
          }

          continue;
        }

        // TODO: Refactor
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
              yield {
                to: s,
                isCapture: true,
                changes: [
                  [ps, null],
                  [s, from],
                  [from, null],
                ],
              };
            }
          } else
            yield {
              to: s,
              changes: [
                [s, from],
                [from, null],
              ],
            };
          continue;
        }

        const isTrace = move.strategy === PieceMoveStrategy.Path;
        const isLeap = move.strategy === PieceMoveStrategy.Leap;

        if (isOwnPiece) {
          if (isTrace) break;
          if (isLeap) continue;
        }

        if (move.isPassive) {
          if (isTrace) break;
          if (isLeap) continue;
        }

        yield {
          to: s,
          isCapture: true,
          changes: [
            [s, from],
            [from, null],
          ],
        };
        if (isTrace) break;
      }
    }
  }
}

if (import.meta.vitest) {
  const { test, expect } = import.meta.vitest;

  test("simulateMove: e4 pawn push", () => {
    const ret = simulateMove(
      createPiece(PieceKind.Pawn, true),
      "e2",
      initBoard(),
      0
    );
    const actual = [...ret];

    const expected: typeof actual = [
      {
        to: "e3",
        changes: [
          ["e3", "e2"],
          ["e2", null],
        ],
      },
      {
        to: "e4",
        changes: [
          ["e4", "e2"],
          ["e2", null],
        ],
      },
    ];
    expect(expected).toStrictEqual(expect.arrayContaining(actual));
  });

  test("simulateMove: e4 pawn push has moved", () => {
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
    const expected: typeof actual = [
      {
        to: "e3",
        changes: [
          ["e3", "e2"],
          ["e2", null],
        ],
      },
    ];
    expect(expected).toStrictEqual(expect.arrayContaining(actual));
  });

  test("simulateMove: queen stuck", () => {
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
    expect(expected).toStrictEqual(expect.arrayContaining(actual));
  });

  test("simulateMove: knight boxed in but can move", () => {
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
    const expected: typeof actual = [
      {
        to: "a3",
        changes: [
          ["a3", "b1"],
          ["b1", null],
        ],
      },
      {
        to: "c3",
        changes: [
          ["c3", "b1"],
          ["b1", null],
        ],
      },
    ];
    expect(expected).toStrictEqual(expect.arrayContaining(actual));
  });

  test("simulateMove: queen comes out", () => {
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
      {
        to: "d3",
        changes: [
          ["d3", "d2"],
          ["d2", null],
        ],
      },
      {
        to: "d4",
        changes: [
          ["d4", "d2"],
          ["d2", null],
        ],
      },
      {
        to: "d5",
        changes: [
          ["d5", "d2"],
          ["d2", null],
        ],
      },
      {
        to: "d6",
        changes: [
          ["d6", "d2"],
          ["d2", null],
        ],
      },
      {
        to: "d7",
        changes: [
          ["d7", "d2"],
          ["d2", null],
        ],
      },
      {
        to: "c3",
        changes: [
          ["c3", "d2"],
          ["d2", null],
        ],
      },
      {
        to: "b4",
        changes: [
          ["b4", "d2"],
          ["d2", null],
        ],
      },
      {
        to: "a5",
        changes: [
          ["a5", "d2"],
          ["d2", null],
        ],
      },
      {
        to: "e3",
        changes: [
          ["e3", "d2"],
          ["d2", null],
        ],
      },
      {
        to: "f4",
        changes: [
          ["f4", "d2"],
          ["d2", null],
        ],
      },
      {
        to: "g5",
        changes: [
          ["g5", "d2"],
          ["d2", null],
        ],
      },
      {
        to: "h6",
        changes: [
          ["h6", "d2"],
          ["d2", null],
        ],
      },
    ];
    expect(expected).toStrictEqual(expect.arrayContaining(actual));
  });
}
