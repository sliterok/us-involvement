import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { InfiltrationMap } from "./Map.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <InfiltrationMap />
  </StrictMode>
);
