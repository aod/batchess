import { pieceNotation } from "../AN/Piece";
import { extractSquareNotation, SquareNotation } from "../AN/Square";
import Board, { initBoard } from "../Board";
import { PieceKind } from "../Piece";
import { isKingChecked } from "./validate";

export default interface Move {
  board: Readonly<Board>;
  from: Readonly<SquareNotation>;
  to: Readonly<SquareNotation>;
}

export function notateMove(move: Move): string {
  let notation: string = move.to;

  const fromPiece = move.board[move.from];
  if (!fromPiece) return "";

  const isPawn = fromPiece?.kind === PieceKind.Pawn;
  const isCapture = move.board[move.to] !== null;

  if (isCapture) {
    notation = "x" + notation;
    if (isPawn) {
      const [file] = extractSquareNotation(move.from);
      notation = file + notation;
    } else {
      notation = pieceNotation(fromPiece.kind) + notation;
    }
  } else {
    if (!isPawn) {
      notation = pieceNotation(fromPiece.kind) + notation;
    }
  }

  if (isKingChecked(move.board, fromPiece.isWhite)) notation += "+";

  return notation;
}

if (import.meta.vitest) {
  const { it, expect } = import.meta.vitest;

  it("should show the correct move notation for a pawn push", () => {
    const board = initBoard();
    const actual = notateMove({ board, from: "a2", to: "a3" });
    expect(actual).toBe("a3");
  });

  it("should show the correct move notation for a pawn capture", () => {
    const board = initBoard();
    board["e4"] = board["e2"];
    board["d5"] = board["d7"];

    const actual = notateMove({ board, from: "e4", to: "d5" });
    expect(actual).toBe("exd5");
  });

  it("should show the correct move notation for a bishop move", () => {
    const board = initBoard();
    board["e4"] = board["e2"];
    board["d5"] = board["d7"];
    board["d5"] = board["e4"];

    const actual = notateMove({ board, from: "f1", to: "b5" });
    expect(actual).toBe("Bb5");
  });
}
