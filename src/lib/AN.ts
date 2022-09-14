import File, { Files } from "./File";
import { PieceKind } from "./Piece";
import Rank, { Ranks } from "./Rank";

export type SquareNotation = `${File}${Rank}`;
export function squareNotation(
  file: Readonly<File>,
  rank: Readonly<Rank>
): SquareNotation {
  return `${file}${rank}`;
}

export function extractSquareNotation(
  pos: Readonly<SquareNotation>
): [File, Rank] {
  const file = pos[0] as File;
  const rank = +pos[1] as Rank;
  return [file, rank];
}

export function flipSquareNotation(
  n: Readonly<SquareNotation>
): SquareNotation {
  const [file, rank] = extractSquareNotation(n);
  const newFile = Files.slice().reverse()[Files.indexOf(file)];
  const newRank = Ranks.slice().reverse()[Ranks.indexOf(rank)];
  return squareNotation(newFile, newRank);
}

export const PieceNotations = ["K", "Q", "R", "B", "N"] as const;
export type PieceNotation = typeof PieceNotations[number];
export type PieceNotationPawn = "";
export function pieceNotation(
  kind: Readonly<PieceKind>
): PieceNotation | PieceNotationPawn {
  switch (kind) {
    case PieceKind.King:
      return "K";
    case PieceKind.Queen:
      return "Q";
    case PieceKind.Rook:
      return "R";
    case PieceKind.Bishop:
      return "B";
    case PieceKind.Knight:
      return "N";
  }
  return "";
}
