import { PropsWithChildren } from "react";
import styles from "./Centered.module.css";

export default function Centered(props: PropsWithChildren) {
  return <div className={styles.centered}>{props.children}</div>;
}
