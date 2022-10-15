import { useContext } from "react";

import { BoardRefContext } from "@/contexts/BoardRefContext";

export default function useSquareSize() {
  const boardRef = useContext(BoardRefContext);
  return (boardRef.current?.clientWidth ?? 1) / 8;
}
