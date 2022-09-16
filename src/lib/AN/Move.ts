import { PieceKind } from "../Piece";
import { pieceNotation } from "./Piece";
import { SquareNotation, extractSNotation } from "./Square";

export enum MoveType {
  Move,
  Capture,
  Castling,
  EndOfGame,
}

export enum CastlingSide {
  Queen,
  King,
}

export enum MoveTypeAttributeOpt {
  Check = "+",
  Mate = "#",
  PawnPromotion = "=",
}

export type MoveTypeAttribute<
  T extends MoveTypeAttributeOpt = MoveTypeAttributeOpt
> = T extends MoveTypeAttributeOpt.PawnPromotion
  ? {
      type: T;
      to: PieceKind;
    }
  : {
      type: T;
    };

export type MoveTypeAttributes = MoveTypeAttribute[];

export type MoveNotation<T extends MoveType = MoveType> =
  T extends MoveType.Castling
    ? {
        type: MoveType.Castling;
        side: CastlingSide;
        attribute?: MoveTypeAttributes;
      }
    : T extends MoveType.EndOfGame
    ? {
        type: MoveType.EndOfGame;
        hasWhiteWon: boolean;
      }
    : {
        type: MoveType;
        from: SquareNotation;
        to: SquareNotation;
        pieceKind: PieceKind;
        attribute?: MoveTypeAttributes;
      };

function displayAttributes(attrs?: MoveTypeAttributes): string {
  if (!attrs) return "";
  let result = "";
  let p: MoveTypeAttribute<MoveTypeAttributeOpt.PawnPromotion>;
  if (
    (p = attrs.find(
      (opt) => opt.type === MoveTypeAttributeOpt.PawnPromotion
    ) as typeof p)
  ) {
    result += "=" + pieceNotation(p.to);
  }
  if (attrs.some((opt) => opt.type === MoveTypeAttributeOpt.Mate)) {
    result += "#";
  } else if (attrs.some((opt) => opt.type === MoveTypeAttributeOpt.Check)) {
    result += "+";
  }
  return result;
}

function displayMoveNotation(notation: MoveNotation): string {
  switch (notation.type) {
    case MoveType.Move: {
      const from = notation.pieceKind === PieceKind.Pawn ? "" : notation.from;

      return `${pieceNotation(notation.pieceKind)}${from}${
        notation.to
      }${displayAttributes(notation.attribute)}`;
    }

    // TODO: Disambigous captures
    case MoveType.Capture: {
      const from =
        notation.pieceKind === PieceKind.Pawn
          ? extractSNotation(notation.from)[0]
          : notation.from;
      return `${pieceNotation(notation.pieceKind)}${from}x${notation.to}`;
    }
  }

  throw new Error("Unreachable");
}

if (import.meta.vitest) {
  const { it, expect } = import.meta.vitest;

  it("should correctly display a pawn move notation", () => {
    const actual = displayMoveNotation({
      type: MoveType.Move,
      from: "e2",
      to: "e4",
      pieceKind: PieceKind.Pawn,
    });

    expect(actual).toBe("e4");
  });

  it("should correctly display a pawn capture notation", () => {
    const actual = displayMoveNotation({
      type: MoveType.Capture,
      from: "e2",
      to: "d3",
      pieceKind: PieceKind.Pawn,
    });

    expect(actual).toBe("exd3");
  });

  it("should correctly display a bishop capture notation", () => {
    const actual = displayMoveNotation({
      type: MoveType.Capture,
      from: "f1",
      to: "e2",
      pieceKind: PieceKind.Bishop,
    });

    expect(actual).toBe("Bf1xe2");
  });

  it("should correctly display a queen check", () => {
    const actual = displayMoveNotation({
      type: MoveType.Move,
      from: "e7",
      to: "d8",
      pieceKind: PieceKind.Queen,
      attribute: [{ type: MoveTypeAttributeOpt.Check }],
    });

    expect(actual).toBe("Qe7d8+");
  });

  it("should correctly display a queen mate", () => {
    const actual = displayMoveNotation({
      type: MoveType.Move,
      from: "e7",
      to: "d8",
      pieceKind: PieceKind.Queen,
      attribute: [{ type: MoveTypeAttributeOpt.Mate }],
    });

    expect(actual).toBe("Qe7d8#");
  });

  it("should correctly display a pawn promotion with check", () => {
    const actual = displayMoveNotation({
      type: MoveType.Move,
      from: "e7",
      to: "e8",
      pieceKind: PieceKind.Pawn,
      attribute: [
        { type: MoveTypeAttributeOpt.PawnPromotion, to: PieceKind.Queen },
        { type: MoveTypeAttributeOpt.Check },
      ],
    });

    expect(actual).toBe("e8=Q+");
  });
}
