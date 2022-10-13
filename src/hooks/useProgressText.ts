import { useState, useMemo, useEffect, useCallback } from "react";

export default function useProgressText(
  text: string,
  opts: { stopOnComplete?: boolean; onFinish?: () => void }
) {
  const [pointer, setPointer] = useState(0);
  const isFinished = useMemo(() => pointer === text.length, [pointer]);

  useEffect(() => {
    function handler(event: KeyboardEvent) {
      if (isFinished && opts.stopOnComplete) return;
      if (event.key === text[pointer]) setPointer(pointer + 1);
      else setPointer(0);
    }
    window.addEventListener("keypress", handler);
    return () => window.removeEventListener("keypress", handler);
  }, [text, pointer, isFinished]);

  const advance = useCallback(() => {
    if (!isFinished) setPointer((p) => p + 1);
  }, [isFinished]);

  useEffect(() => {
    if (isFinished) opts.onFinish?.();
  }, [isFinished]);

  return { pointer, isFinished, advance } as const;
}
