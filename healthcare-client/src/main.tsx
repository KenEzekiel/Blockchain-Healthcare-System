import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { MetaMaskProvider } from "@metamask/sdk-react";
import { Provider } from "@/components/ui/provider";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <MetaMaskProvider
      debug={true}
      sdkOptions={{
        dappMetadata: {
          name: "BPJS App",
          url: window.location.href,
        },
      }}
    >
      <Provider>
        <App />
      </Provider>
    </MetaMaskProvider>
  </StrictMode>
);
