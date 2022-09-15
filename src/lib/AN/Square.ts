import File, { Files } from "../File";
import Rank, { Ranks } from "../Rank";

export type SquareNotation = `${File}${Rank}`;

export function squareNotation(
  file: Readonly<File>,
  rank: Readonly<Rank>
): SquareNotation {
  return `${file}${rank}`;
}

export function extractSquareNotation(
  sNotation: Readonly<SquareNotation>
): [File, Rank] {
  const file = sNotation[0] as File;
  const rank = +sNotation[1] as Rank;
  return [file, rank];
}

export function flipSquareNotation(
  sNotation: Readonly<SquareNotation>
): SquareNotation {
  const [file, rank] = extractSquareNotation(sNotation);
  const newFile = Files.slice().reverse()[Files.indexOf(file)];
  const newRank = Ranks.slice().reverse()[Ranks.indexOf(rank)];
  return squareNotation(newFile, newRank);
}
