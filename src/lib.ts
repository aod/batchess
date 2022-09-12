export enum PieceKind {
  King,
  Queen,
  Bishop,
  Knight,
  Rook,
  Pawn,
}

export interface Piece {
  kind: PieceKind;
  isBlack: boolean;
}

export const Ranks = [1, 2, 3, 4, 5, 6, 7, 8] as const;
export type Rank = typeof Ranks[number];

export const Files = ["a", "b", "c", "d", "e", "f", "g", "h"] as const;
export type File = typeof Files[number];

export type Position = `${File}${Rank}`;
export type Board = { [K in Position]: Piece | null };

export type Player = "white" | "black";

export function createPosition(
  file: Readonly<File>,
  rank: Readonly<Rank>
): Position {
  return `${file}${rank}` as Position;
}

export function extractPosition(pos: Readonly<Position>): [File, Rank] {
  const file = pos[0] as File;
  const rank = +pos[1] as Rank;
  return [file, rank];
}

export function flipPosition(pos: Readonly<Position>): Position {
  const [file, rank] = extractPosition(pos);
  const newFile = Files.slice().reverse()[Files.indexOf(file)];
  const newRank = Ranks.slice().reverse()[Ranks.indexOf(rank)];
  return createPosition(newFile, newRank);
}

function createRankPositioner(
  r: Readonly<Rank>
): (f: Readonly<File>) => Position {
  return (f) => createPosition(f, r);
}

function createEmptyBoard(): Board {
  return Files.reduce((acc, file) => {
    for (const rank of Ranks) acc[createPosition(file, rank)] = null;
    return acc;
  }, {} as Board);
}

function createPiece(kind: PieceKind, player: Player): Piece {
  return { kind, isBlack: player === "black" };
}

function assignPiecesFor(player: Player, board: Readonly<Board>): Board {
  const first = createRankPositioner(player === "white" ? 1 : 8);
  const second = createRankPositioner(player === "white" ? 2 : 7);

  return Object.assign(board, {
    [first("a")]: createPiece(PieceKind.Rook, player),
    [first("b")]: createPiece(PieceKind.Knight, player),
    [first("c")]: createPiece(PieceKind.Bishop, player),
    [first("d")]: createPiece(PieceKind.Queen, player),
    [first("e")]: createPiece(PieceKind.King, player),
    [first("f")]: createPiece(PieceKind.Bishop, player),
    [first("g")]: createPiece(PieceKind.Knight, player),
    [first("h")]: createPiece(PieceKind.Rook, player),

    [second("a")]: createPiece(PieceKind.Pawn, player),
    [second("b")]: createPiece(PieceKind.Pawn, player),
    [second("c")]: createPiece(PieceKind.Pawn, player),
    [second("d")]: createPiece(PieceKind.Pawn, player),
    [second("e")]: createPiece(PieceKind.Pawn, player),
    [second("f")]: createPiece(PieceKind.Pawn, player),
    [second("g")]: createPiece(PieceKind.Pawn, player),
    [second("h")]: createPiece(PieceKind.Pawn, player),
  } as Board);
}

export function initBoard(): Board {
  let board = createEmptyBoard();
  board = assignPiecesFor("white", board);
  board = assignPiecesFor("black", board);
  return board;
}
