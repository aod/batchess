import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

import { BoardRefContext } from "@/contexts/BoardRefContext";
import useAudio from "@/hooks/useAudio";
import { SquareNotation, flipSNotation } from "@/lib/AN/Square";
import { chessStore, selectIsFlipped, useChessStore } from "@/lib/Chess";
import XY, { boardXYtoIdx, XYtoSquare } from "@/util/XY";

export interface IPieceMoveHandlerContext {
  pieceStartIdx: XY | null;
  movingPieceIdx: XY | null;
  onPieceMove: (xy: XY) => void;
  play: () => void;
  reset: () => void;
}

export const PieceMoveHandlerContext = createContext<IPieceMoveHandlerContext>(
  {} as IPieceMoveHandlerContext
);

export function PieceMoveHandlerProvider(props: PropsWithChildren) {
  const boardRef = useContext(BoardRefContext);
  const isFlipped = useChessStore(selectIsFlipped);

  const playMoveSfx = useAudio("/sound/Move.mp3");
  const playCaptureSfx = useAudio("/sound/Capture.mp3");

  const [pieceStartIdx, setPieceStartIdx] =
    useState<IPieceMoveHandlerContext["pieceStartIdx"]>(null);
  const [movingPieceIdx, setMovingPieceIdx] =
    useState<IPieceMoveHandlerContext["movingPieceIdx"]>(null);

  useEffect(() => {
    window.addEventListener("blur", reset);
    () => window.removeEventListener("blur", reset);
  }, []);

  const toBoardSquare = useCallback(
    (xy: XY): SquareNotation => {
      const s = XYtoSquare(xy);
      return isFlipped ? flipSNotation(s) : s;
    },
    [isFlipped]
  );

  const reset: IPieceMoveHandlerContext["reset"] = useCallback(() => {
    setPieceStartIdx(null);
    setMovingPieceIdx(null);
  }, []);

  const play: IPieceMoveHandlerContext["play"] = useCallback(() => {
    if (!pieceStartIdx || !movingPieceIdx) return;

    let from = toBoardSquare(pieceStartIdx!);
    let to = toBoardSquare(movingPieceIdx!);
    const { hasMoved, isCapture } = chessStore.playMove(from, to);
    if (hasMoved) {
      if (isCapture) playCaptureSfx();
      else playMoveSfx();
    }

    reset();
  }, [reset, movingPieceIdx, pieceStartIdx]);

  const onPieceMove: IPieceMoveHandlerContext["onPieceMove"] = useCallback(
    (xy) => {
      const squareSize = (boardRef.current?.clientWidth ?? 1) / 8;
      const idx = boardXYtoIdx(xy, boardRef.current!, squareSize);
      if (!pieceStartIdx) setPieceStartIdx(idx);
      if (movingPieceIdx?.x !== idx.x || movingPieceIdx?.y !== idx.y)
        setMovingPieceIdx(idx);
    },
    [movingPieceIdx, pieceStartIdx]
  );

  return (
    <PieceMoveHandlerContext.Provider
      value={{
        movingPieceIdx,
        pieceStartIdx,
        play,
        reset,
        onPieceMove,
      }}
    >
      {props.children}
    </PieceMoveHandlerContext.Provider>
  );
}
