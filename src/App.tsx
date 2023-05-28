import React from 'react'
import { Footer } from './components/Footer'
import { CardTable } from './components/CardTable'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { DndProvider } from 'react-dnd'
import { CardDefinition } from './CardDefinition'
import './App.css'

function App() {
  return (
    <div className="App">
      <DndProvider backend={HTML5Backend}>
        <CardTable
          initialCards={CardDefinition}
        />
      </DndProvider>
      <Footer />
    </div>
  )
}

export default App
