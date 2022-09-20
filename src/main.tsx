import "modern-normalize";
import "@/main.css";

import React, { Suspense, useEffect, useState } from "react";
import ReactDOM from "react-dom/client";

import App from "@/components/App";
import Spinner from "@/components/icons/Spinner";
import Centered from "@/components/Centered";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <Suspense fallback={<Fallback />}>
      <App />
    </Suspense>
  </React.StrictMode>
);

function Fallback() {
  const SHOW_RENDER_AFTER_MS = 500;
  const [renderSpinner, setRenderSpinner] = useState(false);

  function showSpinner() {
    setRenderSpinner(true);
  }

  useEffect(() => {
    const id = setTimeout(showSpinner, SHOW_RENDER_AFTER_MS);
    return () => clearTimeout(id);
  }, []);

  return <Centered>{renderSpinner && <Spinner />}</Centered>;
}
