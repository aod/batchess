import { RefObject } from "react";

export default function useInlineRefWidth(
  ref: RefObject<HTMLElement>,
  untilChildIndex: number
) {
  const el = ref.current;
  if (!el) return 0;
  const length = el?.children.length ?? 0;
  const idx = Math.min(untilChildIndex, length - 1);
  let width = (el?.children[idx] as HTMLElement)?.offsetLeft ?? 0;
  if (untilChildIndex >= length)
    width += (el?.children[length - 1] as HTMLElement).offsetWidth;
  return width;
}
