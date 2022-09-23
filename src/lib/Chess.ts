import { useSyncExternalStore } from "react";

import { SquareNotation } from "@/lib/AN/Square";
import Board, { initBoard } from "@/lib/Board";
import { simulateMove } from "@/lib/move/simulate";

export interface ChessState {
  board: Board;
  isCurrentTurnWhite: boolean;
  isFlipped: boolean;
  currentTurn: number;
}

export interface ExternalStore<T> {
  getState(): T;
  subscribe(cb: () => void): () => void;
}

export interface ChessStore extends ExternalStore<ChessState> {
  playMove(
    a: SquareNotation,
    b: SquareNotation
  ): { hasMoved: boolean; isCapture?: boolean };
  setIsFlipped(isFlipped: boolean): void;
}

export function initialChessState(): ChessState {
  return {
    board: initBoard(),
    isCurrentTurnWhite: true,
    isFlipped: false,
    currentTurn: 1,
  };
}

export function createChessStore(state: ChessState): ChessStore {
  const listeners = new Set<() => void>();

  function notify() {
    for (const listener of listeners) {
      listener();
    }
  }

  return {
    getState() {
      return state;
    },

    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },

    playMove(a, b) {
      const piece = state.board[a];
      if (!piece) return { hasMoved: false };

      const validMoves = [
        ...simulateMove(piece, a, state.board, state.currentTurn),
      ];
      const move = validMoves.find((move) => move.to === b);
      if (!move) return { hasMoved: false };

      if (piece.firstMoveAtTurn === undefined) {
        piece.firstMoveAtTurn = state.currentTurn;
      }

      for (const [dest, src] of move.changes) {
        if (src) state.board[dest] = state.board[src];
        else state.board[dest] = null;
      }

      state.isCurrentTurnWhite = !state.isCurrentTurnWhite;
      state.currentTurn += 1;

      notify();
      return { hasMoved: true, isCapture: move.isCapture };
    },

    setIsFlipped(isFlipped) {
      state.isFlipped = isFlipped;
      notify();
    },
  };
}

export const chessStore = createChessStore(initialChessState());

export function useChessStore<T>(selector: (state: ChessState) => T) {
  return useSyncExternalStore(chessStore.subscribe, () =>
    selector(chessStore.getState())
  );
}

export const selectBoard = (state: ChessState) => state.board;
export const selectIsFlipped = (state: ChessState) => state.isFlipped;
export const selectCurrentTurn = (state: ChessState) => state.currentTurn;
