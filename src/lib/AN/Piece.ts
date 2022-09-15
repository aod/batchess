import { PieceKind } from "../Piece";

export const PieceNotations = ["K", "Q", "R", "B", "N"] as const;
export type PieceNotationPawn = "";
export type PieceNotationChar = typeof PieceNotations[number];
export type PieceNotation = PieceNotationChar | PieceNotationPawn;

const PKtoPN: Readonly<Record<PieceKind, PieceNotation>> = {
  [PieceKind.King]: "K",
  [PieceKind.Queen]: "Q",
  [PieceKind.Rook]: "R",
  [PieceKind.Bishop]: "B",
  [PieceKind.Knight]: "N",
  [PieceKind.Pawn]: "",
};

export function pieceNotation(pKind: Readonly<PieceKind>): PieceNotation {
  return PKtoPN[pKind];
}

const PNtoPK: Readonly<Record<PieceNotation, PieceKind>> = {
  K: PieceKind.Knight,
  Q: PieceKind.Queen,
  R: PieceKind.Rook,
  B: PieceKind.Bishop,
  N: PieceKind.Knight,
  [""]: PieceKind.Pawn,
};

export function extractPieceNotation(
  pNotation: Readonly<PieceNotation>
): PieceKind {
  return PNtoPK[pNotation];
}
