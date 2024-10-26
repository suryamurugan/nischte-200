import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import ciaLogo from "./assets/cia-logo.png";

const link = document.createElement("link");
link.rel = "icon";
link.type = "image/png";
link.href = ciaLogo;
document.head.appendChild(link);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
