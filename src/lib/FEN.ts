import { pieceNotation } from "@/lib/AN/Piece";
import { SquareNotation } from "@/lib/AN/Square";
import Piece from "@/lib/Piece";

export type PiecePlacementValue = Piece | number;
export type PiecePlacementRow = PiecePlacementValue[];
export type PiecePlacement = PiecePlacementRow[];

export enum AvailableCastlingSide {
  Queen,
  King,
  Both,
}
export type CastlingAvailability = {
  white?: AvailableCastlingSide;
  black?: AvailableCastlingSide;
};

/**
 * Forsyth–Edwards Notation (FEN) is a standard notation for describing a
 * particular board position of a chess game. The purpose of FEN is to provide
 * all the necessary information to restart a game from a particular position.
 */
export interface FENData {
  /**
   * Each rank is described, starting with rank 8 and ending with rank 1, with
   * a "/" between each one; within each rank, the contents of the squares are
   * described in order from the a-file to the h-file. Each piece is identified
   * by a single letter taken from the standard English names in algebraic
   * notation (pawn = "P", knight = "N", bishop = "B", rook = "R", queen = "Q"
   * and king = "K"). White pieces are designated using uppercase
   * letters ("PNBRQK"), while black pieces use lowercase letters
   * ("pnbrqk"). A set of one or more consecutive empty squares
   * within a rank is denoted by a digit from "1" to "8",
   * corresponding to the number of squares.
   */
  piecePlacement: PiecePlacement;
  isCurrentTurnWhite: boolean;
  /**
   * If neither side has the ability to castle, this field uses the character
   * "-". Otherwise, this field contains one or more letters: "K" if White can
   * castle kingside, "Q" if White can castle queenside, "k" if Black can
   * castle kingside, and "q" if Black can castle queenside. A situation
   * that temporarily prevents castling does not prevent the use of this
   * notation.
   */
  castlingAvailability: CastlingAvailability;
  /**
   * This is a square over which a pawn has just passed while moving two
   * squares; it is given in algebraic notation. If there is no en passant
   * target square, this field uses the character "-".
   */
  enPassantSquare?: SquareNotation;
  /**
   * The number of halfmoves since the last capture or pawn advance, used for
   * the [fifty-move rule](https://en.wikipedia.org/wiki/Fifty-move_rule).
   */
  halfMoves: number;
  /**
   * The number of the full moves. It starts at 1 and is incremented after
   * Black's move.
   */
  fullMoves: number;
}

export function displayFEN(fen: Readonly<FENData>) {
  return [
    displayPiecePlacement(fen),
    displayCurrentTurn(fen),
    displayCastlingAvailability(fen),
    displayEnPassantSquare(fen),
    displayHalfMoves(fen),
    displayFullmoves(fen),
  ].join(" ");
}

export function displayPiecePlacement({
  piecePlacement,
}: Readonly<FENData>): string {
  return piecePlacement
    .map((rank) =>
      rank
        .map((piece) =>
          typeof piece === "number" ? piece : displayPieceType(piece)
        )
        .join("")
    )
    .join("/");
}

export function displayCurrentTurn({
  isCurrentTurnWhite,
}: Readonly<FENData>): string {
  return isCurrentTurnWhite ? "w" : "b";
}

export function displayCastlingAvailability({
  castlingAvailability: ca,
}: Readonly<FENData>) {
  let result = "";

  if (ca?.white === AvailableCastlingSide.Queen) result += "Q";
  else if (ca?.white === AvailableCastlingSide.King) result += "K";
  else if (ca?.white === AvailableCastlingSide.Both) result += "QK";

  if (ca?.black === AvailableCastlingSide.Queen) result += "q";
  else if (ca?.black === AvailableCastlingSide.King) result += "k";
  else if (ca?.black === AvailableCastlingSide.Both) result += "qk";

  if (!result.length) result = "-";
  return result;
}

export function displayEnPassantSquare({
  enPassantSquare,
}: Readonly<FENData>): string {
  return enPassantSquare ?? "-";
}

export function displayHalfMoves({ halfMoves }: Readonly<FENData>): string {
  return "" + halfMoves;
}

export function displayFullmoves({ fullMoves }: Readonly<FENData>): string {
  return "" + fullMoves;
}

export function displayPieceType(piece: Readonly<Piece>): string {
  const notation = pieceNotation(piece.kind);
  if (notation && !piece.isWhite) return notation.toLowerCase();
  if (!notation) return piece.isWhite ? "P" : "p";
  return notation;
}
