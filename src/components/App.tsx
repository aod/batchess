import styles from "@/components/App.module.css";
import { LazyMotion } from "framer-motion";
import { Suspense } from "react";

import Board from "@/components/Board";
import Controls from "@/components/Controls";
import Spinner from "@/components/icons/Spinner";
import withDelay from "@/hoc/withDelay";

export default function App() {
  const Fallback = withDelay(Spinner);

  return (
    <div id="app" className={styles.app}>
      <div className={styles.game}>
        <Suspense fallback={<Fallback />}>
          <LazyMotion strict features={loadMotionFeatures}>
            <Board />
            <Controls />
          </LazyMotion>
        </Suspense>
      </div>
    </div>
  );
}

async function loadMotionFeatures() {
  const module = await import("../motion-features");
  return module.default;
}
