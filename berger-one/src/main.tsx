import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import './styles/custom.css'
import './styles/tailwind.css'

const container = document.getElementById('root')

if (container) {
  // Check if this is an SSR hydration
  if (container.hasChildNodes()) {
    try {
      // Hydrate the existing SSR content
      ReactDOM.hydrateRoot(container, <App />)
      console.log('✅ SSR hydration successful')
    } catch (error) {
      console.error('❌ SSR hydration failed, falling back to client-side rendering:', error)
      // Fallback to client-side rendering if hydration fails
      ReactDOM.createRoot(container).render(<App />)
    }
  } else {
    // Client-side rendering (no SSR content)
    ReactDOM.createRoot(container).render(<App />)
    console.log('✅ Client-side rendering')
  }
}
