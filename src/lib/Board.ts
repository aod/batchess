import File, { Files } from "./File";
import Rank, { Ranks } from "./Rank";
import Piece, { createPiece, PieceKind } from "./Piece";
import {
  AvailableCastlingSide,
  displayFEN,
  PiecePlacement,
  PiecePlacementRow,
} from "./FEN";
import { SquareNotation, squareNotation } from "./AN/Square";

type Board = { [K in SquareNotation]: Piece | null };
export default Board;

export function at(board: Board, f: File, r: Rank) {
  return board[`${f}${r}`];
}

function createEmptyBoard(): Board {
  return Files.reduce((acc, file) => {
    for (const rank of Ranks) acc[squareNotation(file, rank)] = null;
    return acc;
  }, {} as Board);
}

function assignPiecesFor(
  player: "white" | "black",
  board: Readonly<Board>
): Board {
  const fileSqNotationCreator = (r: Rank) => (f: File) => squareNotation(f, r);
  const firstRow = fileSqNotationCreator(player === "white" ? 1 : 8);
  const secondRow = fileSqNotationCreator(player === "white" ? 2 : 7);

  const pieceCreator = (kind: PieceKind) =>
    createPiece(kind, player === "white");

  return Object.assign(board, {
    [firstRow("a")]: pieceCreator(PieceKind.Rook),
    [firstRow("b")]: pieceCreator(PieceKind.Knight),
    [firstRow("c")]: pieceCreator(PieceKind.Bishop),
    [firstRow("d")]: pieceCreator(PieceKind.Queen),
    [firstRow("e")]: pieceCreator(PieceKind.King),
    [firstRow("f")]: pieceCreator(PieceKind.Bishop),
    [firstRow("g")]: pieceCreator(PieceKind.Knight),
    [firstRow("h")]: pieceCreator(PieceKind.Rook),

    [secondRow("a")]: pieceCreator(PieceKind.Pawn),
    [secondRow("b")]: pieceCreator(PieceKind.Pawn),
    [secondRow("c")]: pieceCreator(PieceKind.Pawn),
    [secondRow("d")]: pieceCreator(PieceKind.Pawn),
    [secondRow("e")]: pieceCreator(PieceKind.Pawn),
    [secondRow("f")]: pieceCreator(PieceKind.Pawn),
    [secondRow("g")]: pieceCreator(PieceKind.Pawn),
    [secondRow("h")]: pieceCreator(PieceKind.Pawn),
  } as Board);
}

export function initBoard(): Board {
  let board = createEmptyBoard();
  board = assignPiecesFor("white", board);
  board = assignPiecesFor("black", board);
  return board;
}

export function findPiece(board: Board, piece: Piece): SquareNotation | null {
  for (const [sNotation, bPiece] of Object.entries(board)) {
    if (bPiece?.kind === piece.kind && bPiece?.isWhite === piece.isWhite) {
      return sNotation as SquareNotation;
    }
  }
  return null;
}

export function isKingChecked(board: Board, forWhite: boolean) {
  const KsNotation = findPiece(board, {
    kind: PieceKind.King,
    isWhite: forWhite,
  })!;

  return false;
}

export function boardFENPiecePlacements(board: Board): PiecePlacement {
  let result: PiecePlacement = [];

  for (let rank = 8; rank > 0; rank--) {
    let emptySquares = 0;
    const row: PiecePlacementRow = [];

    for (let fileOffset = 0; fileOffset < 8; fileOffset++) {
      const file = String.fromCharCode(97 + fileOffset) as File;
      const pos = squareNotation(file, rank as Rank);
      const piece = board[pos];

      if (!piece) emptySquares += 1;
      else {
        if (emptySquares !== 0) row.push(emptySquares);
        emptySquares = 0;
        row.push(piece);
      }
    }

    if (emptySquares !== 0) row.push(emptySquares);
    result.push(row);
  }

  return result;
}

export function boardFEN(board: Board) {
  return displayFEN({
    piecePlacement: boardFENPiecePlacements(board),
    castlingAvailability: {
      white: AvailableCastlingSide.Both,
      black: AvailableCastlingSide.Both,
    },
    isCurrentTurnWhite: true,
    halfMoves: 0,
    fullMoves: 1,
  });
}
