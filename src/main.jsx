import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
// import "@fontsource/roboto"; // Defaults to weight 400
// import "@fontsource/roboto/400.css"; // Specify weight
// import "@fontsource/roboto/400-italic.css"; // Specify weight and style

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
      <Toaster />
    </BrowserRouter>
  </StrictMode>,
)
