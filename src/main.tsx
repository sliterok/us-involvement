import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import Map from "./Map.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Map />
  </StrictMode>
);
