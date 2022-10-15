import styles from "@/components/App.module.css";
import { LazyMotion } from "framer-motion";
import { Suspense, useRef } from "react";

import Board from "@/components/Board";
import Controls from "@/components/Controls";
import Spinner from "@/components/icons/Spinner";
import Header from "@/components/Header";

import withDelay from "@/hoc/withDelay";
import { BoardRefProvider } from "@/contexts/BoardRefContext";
import { PieceMoveHandlerProvider } from "@/contexts/PieceMoveHandlerContext";
import { PiecesThemeProvider } from "@/contexts/PiecesThemeContext";

export default function App() {
  const Fallback = withDelay(HiddenGameWSpinner, true);
  const boardRef = useRef<HTMLDivElement>(null);

  return (
    <PiecesThemeProvider>
      <div id="app" className={styles.app}>
        <Header />
        <div className={styles.game}>
          <Suspense fallback={<Fallback />}>
            <LazyMotion strict features={loadMotionFeatures}>
              <BoardRefProvider boardRef={boardRef}>
                <PieceMoveHandlerProvider>
                  <Board ref={boardRef} />
                </PieceMoveHandlerProvider>
              </BoardRefProvider>
              <Controls />
            </LazyMotion>
          </Suspense>
        </div>
      </div>
    </PiecesThemeProvider>
  );
}

function HiddenGameWSpinner() {
  return (
    <div
      style={{
        height: "calc(var(--piece-size) * 8)",
        width: "calc(calc(var(--piece-size) * 8) + 2.5rem)",
      }}
    >
      <Spinner />
    </div>
  );
}

async function loadMotionFeatures() {
  const module = await import("../motion-features");
  return module.default;
}
