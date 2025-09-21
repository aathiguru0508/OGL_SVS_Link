import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import Viewer from './Viewer'
import './index.css'

const path = window.location.pathname
const root = createRoot(document.getElementById('root'))

if (path === '/viewer') {
  root.render(<Viewer />)
} else {
  root.render(<App />)
}
