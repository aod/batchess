import { createContext, PropsWithChildren, RefObject } from "react";

export const BoardRefContext = createContext<RefObject<HTMLElement>>(
  null as unknown as RefObject<HTMLElement>
);

export interface BoardRefProviderProps {
  boardRef: RefObject<HTMLElement>;
}

export function BoardRefProvider(
  props: PropsWithChildren<BoardRefProviderProps>
) {
  return (
    <BoardRefContext.Provider value={props.boardRef}>
      {props.children}
    </BoardRefContext.Provider>
  );
}
