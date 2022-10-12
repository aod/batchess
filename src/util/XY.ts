import {
  extractSNotation,
  SquareNotation,
  squareNotation,
} from "@/lib/AN/Square";
import File from "@/lib/File";
import Rank from "@/lib/Rank";
import { clamp } from "@/util/math";
import { nxtChr } from "@/util/string";

export default interface XY {
  x: number;
  y: number;
}

export function boardXYtoIdx(
  xy: XY,
  board: {
    offsetLeft: number;
    offsetTop: number;
    clientWidth: number;
    clientHeight: number;
  },
  squareSize: number
): XY {
  const { offsetLeft, offsetTop, clientWidth, clientHeight } = board;

  const x = clamp(0, xy.x - offsetLeft, clientWidth - 1);
  const y = clamp(0, xy.y - offsetTop, clientHeight - 1);

  const xIdx = Math.floor(x / squareSize);
  const yIdx = Math.floor(y / squareSize);

  return { x: xIdx, y: yIdx };
}

export function XYtoSquare({ x, y }: XY): SquareNotation {
  const rank = 8 - y;
  if (rank < 1) throw new Error(`Invalid rank notation ${rank}`);
  const file = nxtChr("a", x);
  if (file > "h") throw new Error(`Invalid file notation ${file}`);
  return squareNotation(file as File, rank as Rank);
}

export function sNotationToIdx(notation: SquareNotation): XY {
  const [file, rank] = extractSNotation(notation);
  return {
    y: 8 - rank,
    x: file.charCodeAt(0) - 97,
  };
}
