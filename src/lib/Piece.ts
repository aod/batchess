export enum PieceKind {
  King,
  Queen,
  Bishop,
  Knight,
  Rook,
  Pawn,
}

type Piece =
  | { isWhite: false; kind: PieceKind }
  | { isWhite: true; kind: PieceKind };
export default Piece;
