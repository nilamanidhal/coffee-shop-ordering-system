import React from "react"
import ReactDOM from "react-dom/client"
import App from "./App.jsx"
import "./index.css"
import { AuthProvider } from "./contexts/AuthContext.jsx"
import { CartProvider } from "./contexts/CartContext.jsx"
import { Toaster } from "react-hot-toast"

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <CartProvider>
        <App />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: "#fff",
              color: "#1e293b",
              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
            },
          }}
        />
      </CartProvider>
    </AuthProvider>
  </React.StrictMode>,
)
