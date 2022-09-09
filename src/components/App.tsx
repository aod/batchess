import { PieceKind } from "../lib";
import Piece from "./Piece";

export default function App() {
  return (
    <div>
      <Piece piece={{ kind: PieceKind.King, isBlack: false }} />
      <Piece piece={{ kind: PieceKind.Queen, isBlack: false }} />
      <Piece piece={{ kind: PieceKind.Rook, isBlack: false }} />
      <Piece piece={{ kind: PieceKind.Bishop, isBlack: true }} />
      <Piece piece={{ kind: PieceKind.Knight, isBlack: true }} />
      <Piece piece={{ kind: PieceKind.Pawn, isBlack: true }} />
    </div>
  );
}
