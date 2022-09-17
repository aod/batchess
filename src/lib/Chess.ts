import { useSyncExternalStore } from "react";
import { SquareNotation } from "./AN/Square";
import Board, { initBoard } from "./Board";
import { simValidMoves } from "./move/valid";
import { PieceKind } from "./Piece";

export interface ChessState {
  board: Board;
  isCurrentTurnWhite: boolean;
  isFlipped: boolean;
}

export interface ExternalStore<T> {
  getState(): T;
  subscribe(cb: () => void): () => void;
}

export interface ChessStore extends ExternalStore<ChessState> {
  playMove(a: SquareNotation, b: SquareNotation): boolean;
  setIsFlipped(isFlipped: boolean): void;
}

export function initialChessState(): ChessState {
  return {
    board: initBoard(),
    isCurrentTurnWhite: false,
    isFlipped: false,
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
      if (!piece) return false;
      const validMoves = [...simValidMoves(piece, a, state.board)];

      if (!validMoves.includes(b)) return false;
      if (piece.kind === PieceKind.Pawn) {
        piece.hasMoved = true;
      }

      state.board[b] = state.board[a];
      state.board[a] = null;
      state.isCurrentTurnWhite = !state.isCurrentTurnWhite;

      notify();
      return true;
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
