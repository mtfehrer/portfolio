import { HashRouter } from "react-router-dom";
import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import ScrollToTop from "./components/ScrollToTop";
import App from "./App";

const root = ReactDOM.createRoot(
    document.getElementById("root") as HTMLElement
);
root.render(
    <React.StrictMode>
        <HashRouter>
            <ScrollToTop />
            <App />
        </HashRouter>
    </React.StrictMode>
);
