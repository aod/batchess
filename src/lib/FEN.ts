import { pieceNotation, SquareNotation } from "./AN";
import Piece from "./Piece";

export type PiecePlacementValue = Piece | number;
export type PiecePlacementRow = PiecePlacementValue[];
export type PiecePlacement = PiecePlacementRow[];

export enum CastlingSide {
  Queen,
  King,
  Both,
}
export type CastlingAvailability = {
  white?: CastlingSide;
  black?: CastlingSide;
};

export interface FENData {
  piecePlacement: PiecePlacement;
  isCurrentTurnWhite: boolean;
  castlingAvailability: CastlingAvailability;
  enPassantSquare?: SquareNotation;
  halfMoves: number;
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

export function displayPiecePlacement({ piecePlacement }: Readonly<FENData>) {
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

  if (ca?.white === CastlingSide.Queen) result += "Q";
  else if (ca?.white === CastlingSide.King) result += "K";
  else if (ca?.white === CastlingSide.Both) result += "QK";

  if (ca?.black === CastlingSide.Queen) result += "q";
  else if (ca?.black === CastlingSide.King) result += "k";
  else if (ca?.black === CastlingSide.Both) result += "qk";

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
