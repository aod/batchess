import {
  Board,
  createPosition,
  Rank,
  Piece,
  File,
  Player,
  PieceKind,
} from "./lib";

export default function fen(board: Board) {
  return [
    _piecePlacement(board),
    "w", // TODO
    "KQkq", // TODO
    "-", // TODO
    0, // TODO
    1, // TODO
  ].join(" ");
}

function _piecePlacement(board: Board) {
  let result = "";

  for (let rank = 8; rank > 0; rank--) {
    let emptySquares = 0;

    for (let fileOffset = 0; fileOffset < 8; fileOffset++) {
      const file = String.fromCharCode(97 + fileOffset) as File;
      const pos = createPosition(file, rank as Rank);
      const piece = board[pos];

      if (!piece) emptySquares += 1;
      else {
        if (emptySquares !== 0) result += emptySquares;
        emptySquares = 0;
        result += _notatePieceType(piece);
      }
    }

    if (emptySquares !== 0) result += emptySquares;
    if (rank !== 1) result += "/";
  }

  return result;
}

const _designations = ["K", "Q", "B", "N", "R", "P"] as const;
type WhitePieceDesignation = typeof _designations[number];
type BlackPieceDesignation = Lowercase<WhitePieceDesignation>;
type PieceDesignation = WhitePieceDesignation | BlackPieceDesignation;

function _notatePieceType(piece: Piece): PieceDesignation {
  return (
    piece.isBlack
      ? _designations[piece.kind].toLowerCase()
      : _designations[piece.kind]
  ) as PieceDesignation;
}

if (import.meta.vitest) {
  const { it, describe, expect } = import.meta.vitest;
  const { createPiece, PieceKind, initBoard } = await import("./lib");

  describe("Standard Algebraic Notation", () => {
    it.each<[Player, string, PieceKind, PieceDesignation]>([
      ["white", PieceKind[PieceKind.King], PieceKind.King, "K"],
      ["white", PieceKind[PieceKind.Queen], PieceKind.Queen, "Q"],
      ["white", PieceKind[PieceKind.Bishop], PieceKind.Bishop, "B"],
      ["white", PieceKind[PieceKind.Knight], PieceKind.Knight, "N"],
      ["white", PieceKind[PieceKind.Rook], PieceKind.Rook, "R"],
      ["white", PieceKind[PieceKind.Pawn], PieceKind.Pawn, "P"],

      ["black", PieceKind[PieceKind.King], PieceKind.King, "k"],
      ["black", PieceKind[PieceKind.Queen], PieceKind.Queen, "q"],
      ["black", PieceKind[PieceKind.Bishop], PieceKind.Bishop, "b"],
      ["black", PieceKind[PieceKind.Knight], PieceKind.Knight, "n"],
      ["black", PieceKind[PieceKind.Rook], PieceKind.Rook, "r"],
      ["black", PieceKind[PieceKind.Pawn], PieceKind.Pawn, "p"],
    ])(
      "should return correct notation for the %s %s",
      (player, _, value, expected) => {
        expect(_notatePieceType(createPiece(value, player))).toBe(expected);
      }
    );
  });

  describe("Piece placement data", () => {
    it("should return the correct data for starting position", () => {
      expect(_piecePlacement(initBoard())).toBe(
        "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR"
      );
    });

    it("should return the correct data after e4", () => {
      const board = initBoard();
      board["e4"] = board["e2"];
      board["e2"] = null;

      expect(_piecePlacement(board)).toBe(
        "rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR"
      );
    });

    it("should return the correct data after e4 c5", () => {
      const board = initBoard();
      board["e4"] = board["e2"];
      board["e2"] = null;

      board["c5"] = board["c7"];
      board["c7"] = null;

      expect(_piecePlacement(board)).toBe(
        "rnbqkbnr/pp1ppppp/8/2p5/4P3/8/PPPP1PPP/RNBQKBNR"
      );
    });

    it("should return the correct data after e4 c5 Nf3", () => {
      const board = initBoard();
      board["e4"] = board["e2"];
      board["e2"] = null;

      board["c5"] = board["c7"];
      board["c7"] = null;

      board["f3"] = board["g1"];
      board["g1"] = null;

      expect(_piecePlacement(board)).toBe(
        "rnbqkbnr/pp1ppppp/8/2p5/4P3/5N2/PPPP1PPP/RNBQKB1R"
      );
    });
  });
}
