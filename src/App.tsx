import React from 'react'
import { Footer } from './components/Footer'
import { CardTable } from './components/CardTable'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { DndProvider } from 'react-dnd'
import { CardCategory, CardType } from './components/Card'
import './App.css'

function App() {
  return (
    <div className="App">
      <DndProvider backend={HTML5Backend}>
        <CardTable
          initialCards={[
            {
              type: CardType.Feeling,
              category: CardCategory.Meow,
              name: 'cold',
              definition: 'Lacking affection or warmth of feeling; unemotional.',
              source: 'https://www.lexico.com/en/definition/cold',
            },
            {
              type: CardType.Need,
              category: CardCategory.Meow,
              name: 'acceptance',
              definition: 'The action or process of being received as adequate or suitable, typically to be admitted into a group.',
              source: 'https://www.lexico.com/en/definition/acceptance',
            },
          ]}
        />
      </DndProvider>
      <Footer />
    </div>
  )
}

export default App
