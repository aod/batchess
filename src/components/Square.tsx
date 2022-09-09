import styles from "./Square.module.css";
import { CSSProperties, PropsWithChildren } from "react";
import { Rank, File } from "../lib";

export interface SquareProps extends PropsWithChildren {
  rank: Rank;
  file: File;
}

export default function Square(props: SquareProps) {
  let isLight = props.rank % 2 == 0;
  if ((props.file.charCodeAt(0) - 97) % 2 == 0) isLight = !isLight;

  return (
    <div
      className={styles.square}
      style={
        {
          ["--square-color"]: isLight
            ? "var(--light-square-color)"
            : "var(--dark-square-color)",
        } as CSSProperties
      }
    >
      {props.children}
    </div>
  );
}
