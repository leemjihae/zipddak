import App from "./App.jsx";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "jotai";
import { HeadProvider } from "react-head";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "tippy.js/dist/tippy.css";
import "./css/reset.css";
import "./css/common.css";

createRoot(document.getElementById("root")).render(
    <HeadProvider>
        {/* <Provider> */}
        <BrowserRouter>
            <App />
        </BrowserRouter>
        {/* </Provider> */}
    </HeadProvider>
);
