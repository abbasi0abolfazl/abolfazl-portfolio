import React from 'react'
import ReactDOM from 'react-dom/client'
import App from '@/App.jsx'
import '@/index.css'

// Disable the browser's automatic scroll restoration BEFORE React renders,
// otherwise reloading while scrolled down makes the page jump to that old
// position (e.g. the bottom) once the content height grows.
if ('scrollRestoration' in window.history) {
  window.history.scrollRestoration = 'manual'
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <App />
)
