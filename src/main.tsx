import React from "react"
import ReactDOM from "react-dom/client"
import { ThemeWrapper } from "./ThemeWrapper.tsx"
import App from "./App.tsx"

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <ThemeWrapper>
            <App />
        </ThemeWrapper>
    </React.StrictMode>
)
