import { useCallback, useContext, useMemo } from "react";

import { BoardRefContext } from "@/contexts/BoardRefContext";

export default function useSquareSize() {
  const boardRef = useContext(BoardRefContext);
  return useCallback(() => (boardRef?.current?.clientWidth ?? 0) / 8, []);
}
