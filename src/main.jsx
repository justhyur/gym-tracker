import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { GlobalContextProvider } from './context/GlobalContext.jsx'
import { BrowserRouter } from 'react-router-dom'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <GlobalContextProvider>
        <App />
    </GlobalContextProvider>
  </BrowserRouter>
)
