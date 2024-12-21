// import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./components/App.tsx";

declare global {
    interface Window {
        map: any;
    }
}

createRoot(document.getElementById("root")!).render(
    // <StrictMode>
    <App />,
    // </StrictMode>
);
