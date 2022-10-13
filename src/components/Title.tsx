import styles from "./Title.module.css";

import { useContext, useRef } from "react";
import { motion } from "framer-motion";
import clsx from "clsx";

import { PiecesThemeContext } from "@/contexts/PiecesThemeContext";
import useProgressText from "@/hooks/useProgressText";
import useInlineRefWidth from "@/hooks/useInlineRefWidth";

const TITLE = "batchess";

export default function Title() {
  const { setTheme } = useContext(PiecesThemeContext);
  const ref = useRef<HTMLHeadingElement>(null);

  const { pointer, isFinished, advance } = useProgressText(TITLE, {
    stopOnComplete: true,
    onFinish: () => setTheme("batchess"),
  });

  const width = useInlineRefWidth(ref, pointer);

  return (
    <div className={styles.title}>
      <h1 className={styles.heading} ref={ref} onClick={advance}>
        {TITLE.split("").map((char, index) => (
          <div key={index} className={styles.char}>
            <span>{char}</span>
          </div>
        ))}
      </h1>

      <Underline width={width} isActive={isFinished} />
    </div>
  );
}

interface UnderlineProps {
  width: number;
  isActive?: boolean;
}

function Underline(props: UnderlineProps) {
  return (
    <motion.div
      className={clsx(styles.underline, props.isActive && styles.active)}
      initial={{ width: 0 }}
      animate={{ width: props.width }}
      layoutId="underline"
    />
  );
}
