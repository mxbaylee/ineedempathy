import React from 'react'
import { Footer } from './components/Footer'
import { CardTable } from './components/CardTable'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { TouchBackend } from 'react-dnd-touch-backend'
import { DndProvider } from 'react-dnd'
import { CardDefinition } from './CardDefinition'
import { Help } from './components/Help'
import { usePreferences } from './hooks/preferences'
import './App.css'

function App() {
  const [preferences, setPreferences] = usePreferences({
    isTouchDevice: (
      ('ontouchstart' in window) || (navigator.maxTouchPoints > 0)
    ),
    settingsVisible: false,
    helpVisible: false,
  })

  return (
    <div className="App">
      <DndProvider backend={preferences.isTouchDevice ? TouchBackend : HTML5Backend}>
        <CardTable
          preferences={preferences}
          initialCards={CardDefinition}
          windows={[
            <Help
              key={'helpVisible'}
              hideHelp={() => {
                setPreferences('helpVisible', false)
              }}
            />,
            <div
              key='settingsVisible'
              className="settings"
            >
              <p>Settings!</p>
            </div>
          ]}
        />
      </DndProvider>
      <Footer setPreferences={setPreferences} />
    </div>
  )
}

export default App
