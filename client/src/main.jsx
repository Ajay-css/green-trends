import { BrowserRouter } from 'react-router-dom'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import ShopContextProvider from './context/ShopContext.jsx'
import { Toaster } from "react-hot-toast"

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <ShopContextProvider>
      <App />
      <Toaster />
    </ShopContextProvider>
  </BrowserRouter>,
)
