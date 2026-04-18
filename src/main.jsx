import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
// import Bill from './bill.jsx'
// import Bill from "./bill_update.jsx";
// import Bill from "./bill_update_v1.jsx";
// import Bill from "./bill_update_v1_contect.jsx";
// import Bill from "./fix_color.jsx";
import Bill from "./update_screenshot.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    {/* <App /> */}
    <Bill />
  </StrictMode>
);
