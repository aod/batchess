import styles from "./Centered.module.css";
import { PropsWithChildren } from "react";

export default function Centered(props: PropsWithChildren) {
  return <div className={styles.centered}>{props.children}</div>;
}
