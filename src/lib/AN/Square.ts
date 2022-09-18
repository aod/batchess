import File, { Files } from "@/lib/File";
import Rank, { Ranks } from "@/lib/Rank";

export type SquareNotation = `${File}${Rank}`;

export function squareNotation(
  file: Readonly<File>,
  rank: Readonly<Rank>
): SquareNotation {
  return `${file}${rank}`;
}

export function extractSNotation(
  sNotation: Readonly<SquareNotation>
): [File, Rank] {
  const file = sNotation[0] as File;
  const rank = +sNotation[1] as Rank;
  return [file, rank];
}

export function flipSNotation(
  sNotation: Readonly<SquareNotation>
): SquareNotation {
  const [file, rank] = extractSNotation(sNotation);
  const newFile = Files.slice().reverse()[Files.indexOf(file)];
  const newRank = Ranks.slice().reverse()[Ranks.indexOf(rank)];
  return squareNotation(newFile, newRank);
}
