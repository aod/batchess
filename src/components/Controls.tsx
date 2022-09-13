import Flip from "./icons/Flip";
import styles from "./Controls.module.css";
import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useState,
} from "react";
import { motion } from "framer-motion";

export default function Controls() {
  const { flip, isFlipped } = useControls();

  return (
    <div className={styles.controls}>
      <motion.button
        animate={{ rotateX: isFlipped ? 180 : 0 }}
        transition={{ type: "tween" }}
        onClick={flip}
        title="Flip board"
      >
        <Flip />
      </motion.button>
    </div>
  );
}

export interface TControlsContext {
  isFlipped: boolean;
  flip: () => void;
}
export const ControlsContext = createContext<TControlsContext>(
  {} as unknown as TControlsContext
);

export function ControlsContextProvider(props: PropsWithChildren) {
  const [isFlipped, setIsFlipped] = useState(false);

  const flip = useCallback(() => {
    setIsFlipped((isFlipped) => !isFlipped);
  }, []);

  return (
    <ControlsContext.Provider value={{ isFlipped, flip }}>
      {props.children}
    </ControlsContext.Provider>
  );
}

export function useControls() {
  return useContext(ControlsContext);
}