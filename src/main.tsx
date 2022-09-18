import "modern-normalize";
import "@/main.css";

import React, { Suspense } from "react";
import ReactDOM from "react-dom/client";

import App from "@/components/App";
import Spinner from "@/components/icons/Spinner";
import Centered from "@/components/Centered";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <Suspense
      fallback={
        <Centered>
          <Spinner />
        </Centered>
      }
    >
      <App />
    </Suspense>
  </React.StrictMode>
);
