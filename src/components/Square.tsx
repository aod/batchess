import styles from "./Square.module.css";
import { CSSProperties, PropsWithChildren } from "react";
import { Rank, File } from "../lib";

export interface SquareProps {
  rank: Rank;
  file: File;
}

export default function Square(props: PropsWithChildren<SquareProps>) {
  let isDark = props.rank % 2 == 0;
  if ((props.file.charCodeAt(0) - 97) % 2 == 0) isDark = !isDark;

  return (
    <div
      className={styles.square}
      style={
        {
          ["--square-color"]: isDark
            ? "var(--dark-square-color)"
            : "var(--light-square-color)",
        } as CSSProperties
      }
    >
      {props.children}
    </div>
  );
}
