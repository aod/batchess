import Piece from "@/components/Piece";
import Square from "@/components/Square";

import { at } from "@/lib/Board";
import {
  useChessStore,
  selectBoard,
  selectIsFlipped,
  selectIsCurrentTurnWhite,
} from "@/lib/Chess";
import { Files } from "@/lib/File";
import TPiece from "@/lib/Piece";
import { Ranks } from "@/lib/Rank";

export default function Pieces() {
  const board = useChessStore(selectBoard);
  const isFlipped = useChessStore(selectIsFlipped);
  const isCurrentTurnWhite = useChessStore(selectIsCurrentTurnWhite);

  const ranks = isFlipped ? Ranks.slice() : Ranks.slice().reverse();
  const files = isFlipped ? Files.slice().reverse() : Files.slice();

  function isPieceDisabled(piece: TPiece) {
    return isCurrentTurnWhite !== piece.isWhite;
  }

  return (
    <>
      {ranks.map((rank, y) => (
        <div key={y} style={{ height: "var(--piece-size)" }}>
          {files.map((file, x) => (
            <Square key={x} rank={rank} file={file}>
              {at(board, file, rank) && (
                <Piece
                  piece={at(board, file, rank)!}
                  disabled={isPieceDisabled(at(board, file, rank)!)}
                />
              )}
            </Square>
          ))}
        </div>
      ))}
    </>
  );
}
