import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import Layout from "./app/layout.tsx";
import { ReactFlowProvider } from "@xyflow/react";
import { ToastProvider } from "./components/ui/toast.tsx";
import { Toaster } from "./components/ui/toaster.tsx";
import { DnDProvider } from "./context/DnDContext.tsx";
import { TooltipProvider } from "./components/ui/tooltip.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
      <ToastProvider>
        <TooltipProvider>
          <Layout>
            <ReactFlowProvider>
              <DnDProvider>
                <App />
              </DnDProvider>
            </ReactFlowProvider>
          </Layout>
          <Toaster />
        </TooltipProvider>
      </ToastProvider>
  </StrictMode>
);
