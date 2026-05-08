import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { StorefrontDataProvider } from '@/hooks/useStorefrontData'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <StorefrontDataProvider>
      <App />
    </StorefrontDataProvider>
  </StrictMode>,
)
