import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Todo from './components/Todo/Todo.tsx'
import './components/Todo/Todo.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Todo />
  </StrictMode>,
)
