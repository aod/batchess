import React, { Suspense } from "react";
import ReactDOM from "react-dom/client";
import App from "./components/App";
import Spinner from "./components/Spinner";
import Centered from "./components/Centered";

import "modern-normalize";
import "./main.css";

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
