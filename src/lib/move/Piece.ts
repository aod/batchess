import { PieceKind } from "@/lib/Piece";

export enum PieceMoveType {
  Pawn,
  Horizontal,
  Vertical,
  Diagonal,
  Knight,
  King,
  EnPassant,
  Fork,
  Castling,
}

export enum PieceMoveStrategy {
  Leap,
  Path,
}

export type PieceMovement<T extends PieceMoveType = PieceMoveType> =
  T extends PieceMoveType.Castling
    ? {
        type: PieceMoveType.Castling;
      }
    : {
        type: PieceMoveType;
        strategy: PieceMoveStrategy;
        isPassive?: boolean;
      };
export type PieceMovements = PieceMovement[];

export const PieceMovements: { [K in PieceKind]: Readonly<PieceMovements> } = {
  [PieceKind.King]: [
    { type: PieceMoveType.King, strategy: PieceMoveStrategy.Leap },
    { type: PieceMoveType.Castling },
  ],
  [PieceKind.Queen]: [
    { type: PieceMoveType.Horizontal, strategy: PieceMoveStrategy.Path },
    { type: PieceMoveType.Vertical, strategy: PieceMoveStrategy.Path },
    { type: PieceMoveType.Diagonal, strategy: PieceMoveStrategy.Path },
  ],
  [PieceKind.Bishop]: [
    { type: PieceMoveType.Diagonal, strategy: PieceMoveStrategy.Path },
  ],
  [PieceKind.Knight]: [
    { type: PieceMoveType.Knight, strategy: PieceMoveStrategy.Leap },
  ],
  [PieceKind.Rook]: [
    { type: PieceMoveType.Horizontal, strategy: PieceMoveStrategy.Path },
    { type: PieceMoveType.Vertical, strategy: PieceMoveStrategy.Path },
  ],
  [PieceKind.Pawn]: [
    {
      type: PieceMoveType.Pawn,
      strategy: PieceMoveStrategy.Path,
      isPassive: true,
    },
    { type: PieceMoveType.Fork, strategy: PieceMoveStrategy.Leap },
    { type: PieceMoveType.EnPassant, strategy: PieceMoveStrategy.Leap },
  ],
};
