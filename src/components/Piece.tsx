import { Piece as TPiece, PieceKind, PiecesAmount } from "../lib";

export interface PieceProps {
  piece: TPiece;
}

const SCALE = 1.5;
export const SIZE = 45 * SCALE;

export default function Piece(props: PieceProps) {
  return (
    <div
      data-kind={PieceKind[props.piece.kind]}
      style={{
        width: SIZE,
        height: SIZE,
        background: "url(Chess_Pieces_Sprite.svg)",
        backgroundPosition: `-${SIZE * props.piece.kind}px ${
          props.piece.isBlack ? `${SIZE}px` : 0
        }`,
        backgroundSize: `${PiecesAmount * SIZE}px ${2 * SIZE}px`,
      }}
    />
  );
}
