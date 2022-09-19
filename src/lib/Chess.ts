import { useSyncExternalStore } from "react";

import { SquareNotation } from "@/lib/AN/Square";
import Board, { initBoard } from "@/lib/Board";
import { PieceKind } from "@/lib/Piece";
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
  playMove(a: SquareNotation, b: SquareNotation): boolean;
  setIsFlipped(isFlipped: boolean): void;
}

export function initialChessState(): ChessState {
  return {
    board: initBoard(),
    isCurrentTurnWhite: false,
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
      if (!piece) return false;

      const validMoves = [
        ...simulateMove(piece, a, state.board, state.currentTurn),
      ];
      const move = validMoves.find((move) => move.to === b);
      if (!move) return false;

      if (
        piece.kind === PieceKind.Pawn &&
        piece.firstMoveAtTurn === undefined
      ) {
        piece.firstMoveAtTurn = state.currentTurn;
      }

      if (move.caputres) {
        state.board[move.caputres] = null;
      }
      state.board[move.to] = state.board[a];
      state.board[a] = null;

      state.isCurrentTurnWhite = !state.isCurrentTurnWhite;
      state.currentTurn += 1;

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
export const selectCurrentTurn = (state: ChessState) => state.currentTurn;
