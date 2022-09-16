import { flipSNotation, SquareNotation } from "../AN/Square";
import Board, { initBoard } from "../Board";
import Piece, { PieceKind } from "../Piece";
import { PieceMovements } from "./Piece";
import { PieveMovKindResolver } from "./pieces";

export function* simValidMoves(
  piece: Piece,
  from: SquareNotation,
  board: Board
) {
  const pieceMovements = PieceMovements[piece.kind];
  const moveResolvers = pieceMovements.type.map(
    (mtype) => PieveMovKindResolver[mtype]
  );

  for (const resolver of moveResolvers) {
    for (const squares of resolver(from, piece.isWhite, false)) {
      for (const s of squares) {
        if (board[s] !== null) {
          // TODO: Refactor
          if ([PieceKind.King, PieceKind.Knight].includes(piece.kind)) {
            continue;
          } else {
            break;
          }
        }

        yield s;
      }
    }
  }
}

if (import.meta.vitest) {
  const { it, expect } = import.meta.vitest;

  it("should return no valid moves for queen at a1 with initial board", () => {
    const ret = simValidMoves(
      { kind: PieceKind.Queen, isWhite: true },
      "a1",
      initBoard()
    );
    const actual = [...ret];

    expect(actual).toStrictEqual([]);
  });
}
