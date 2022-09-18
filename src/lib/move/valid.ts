import {
  extractSNotation,
  squareNotation,
  SquareNotation,
} from "@/lib/AN/Square";
import Board, { initBoard } from "@/lib/Board";
import Piece, { PieceKind } from "@/lib/Piece";
import { PieceMovements } from "@/lib/move/Piece";
import { PieveMovKindResolver } from "@/lib/move/pieces";

export function* simValidMoves(
  piece: Piece,
  from: SquareNotation,
  board: Board,
  currentTurn: number
) {
  const pieceMovements = PieceMovements[piece.kind];
  const moveResolvers = pieceMovements.type.map(
    (mtype) => PieveMovKindResolver[mtype]
  );

  for (const resolver of moveResolvers) {
    for (const squares of resolver(
      from,
      piece.isWhite,
      piece.kind === PieceKind.Pawn
        ? piece.firstMoveAtTurn !== undefined
        : false
    )) {
      for (const s of squares) {
        const boardPiece = board[s];

        if (piece.kind === PieceKind.Pawn) {
          const [fromFile, fromRank] = extractSNotation(from);
          const [toFile] = extractSNotation(s);

          const isCaptureable =
            boardPiece !== null && boardPiece.isWhite !== piece.isWhite;
          const otherPiece = board[squareNotation(toFile, fromRank)];
          const isEnPassant =
            otherPiece?.kind === PieceKind.Pawn &&
            otherPiece.isWhite !== piece.isWhite &&
            otherPiece.firstMoveAtTurn === currentTurn - 1 &&
            [4, 5].includes(fromRank);

          if (fromFile === toFile) {
            if (boardPiece === null) yield s;
          } else if (isCaptureable || isEnPassant) {
            yield s;
          }
        } else if (!boardPiece) {
          yield s;
        } else if (
          [PieceKind.Queen, PieceKind.Bishop, PieceKind.Rook].includes(
            piece.kind
          )
        ) {
          if (boardPiece.isWhite !== piece.isWhite) {
            yield s;
          }
          break;
        } else if ([PieceKind.King, PieceKind.Knight].includes(piece.kind)) {
          if (boardPiece.isWhite !== piece.isWhite) {
            yield s;
          }
        }
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
      initBoard(),
      0
    );
    const actual = [...ret];

    expect(actual).toStrictEqual([]);
  });
}
