import styles from "./Square.module.css";
import { PropsWithChildren } from "react";
import { Rank, File } from "../lib";
import clsx from "clsx";

export interface SquareProps {
  rank: Rank;
  file: File;
}

export default function Square(props: PropsWithChildren<SquareProps>) {
  let isDark = props.rank % 2 == 0;
  if ((props.file.charCodeAt(0) - 97) % 2 == 0) isDark = !isDark;

  return (
    <div className={clsx(styles.square, isDark ? styles.dark : styles.light)}>
      {props.children}
    </div>
  );
}
