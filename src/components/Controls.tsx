import styles from "./Controls.module.css";
import { m } from "framer-motion";

import Flip from "./icons/Flip";

import { chessStore, selectIsFlipped, useChessStore } from "../lib/Chess";

export default function Controls() {
  const isFlipped = useChessStore(selectIsFlipped);

  return (
    <div className={styles.controls}>
      <m.button
        animate={{ rotateX: isFlipped ? 180 : 0 }}
        transition={{ type: "tween" }}
        onClick={() => chessStore.setIsFlipped(!isFlipped)}
        title="Flip board"
      >
        <Flip />
      </m.button>
    </div>
  );
}
