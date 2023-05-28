import React from 'react'
import { Footer } from './components/Footer'
import { CardTable } from './components/CardTable'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { TouchBackend } from 'react-dnd-touch-backend'
import { DndProvider } from 'react-dnd'
import { CardDefinition } from './CardDefinition'
import './App.css'

function App() {
  const isTouchDevice = (('ontouchstart' in window) || (navigator.maxTouchPoints > 0))
  return (
    <div className="App">
      <DndProvider backend={isTouchDevice ? TouchBackend : HTML5Backend}>
        <CardTable
          initialCards={CardDefinition}
        />
      </DndProvider>
      <Footer />
    </div>
  )
}

export default App
