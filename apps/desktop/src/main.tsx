import { ShellFeature } from "@workspace/shell/shell-feature";
import { StrictMode } from "react";
import ReactDOM from "react-dom/client";

const root = document.getElementById("root");
if (!root) {
  throw new Error("Root element not found");
}

ReactDOM.createRoot(root).render(
  <StrictMode>
    <ShellFeature />
  </StrictMode>,
);
