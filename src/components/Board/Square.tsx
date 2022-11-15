import styles from "./Square.module.css";
import { CSSProperties, PropsWithChildren } from "react";

interface SquareProps {
  x: number;
  y: number;
}

export default function Square(props: PropsWithChildren<SquareProps>) {
  return (
    <div
      className={styles.square}
      style={
        {
          ["--square-x"]: props.x,
          ["--square-y"]: props.y,
        } as CSSProperties
      }
    >
      <div className={styles.inner}>{props.children}</div>
    </div>
  );
}
