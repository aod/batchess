import { useSyncExternalStore } from "react";
import Board, { initBoard } from "./Board";

export interface ChessState {
  board: Board;
  isCurrentTurnWhite: boolean;
}

export interface ChessStore {
  getState(): ChessState;
  subscribe(cb: () => void): () => void;
  playMove(move: string): void;
}

export function initialChessState(): ChessState {
  return {
    board: initBoard(),
    isCurrentTurnWhite: false,
  };
}

export function createChessStore(state: ChessState): ChessStore {
  const listeners = new Set();

  return {
    getState() {
      return state;
    },
    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },

    playMove(mNotation) {
      state.isCurrentTurnWhite = !state.isCurrentTurnWhite;
      // const [piece, sNotation, isCapture] = extractMoveNotation(move);
    },
  };
}

export const chessStore = createChessStore(initialChessState());
export function useChessStore<T>(selector: (state: ChessState) => T) {
  return useSyncExternalStore(chessStore.subscribe, () =>
    selector(chessStore.getState())
  );
}
