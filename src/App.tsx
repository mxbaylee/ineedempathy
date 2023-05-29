import React from 'react'
import { Footer } from './components/Footer'
import { CardTable } from './components/CardTable'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { TouchBackend } from 'react-dnd-touch-backend'
import { DndProvider } from 'react-dnd'
import { CardDefinition } from './CardDefinition'
import { Help } from './components/Help'
import { useSettings } from './hooks/settings'
import { SettingsPanel } from './components/SettingsPanel'
import './App.css'

function App() {
  const [settings, setSettings] = useSettings({
    isTouchDevice: (
      ('ontouchstart' in window) || (navigator.maxTouchPoints > 0)
    ),
    settingsVisible: false,
    helpVisible: false,
  })

  return (
    <div className="App">
      <DndProvider backend={settings.isTouchDevice ? TouchBackend : HTML5Backend}>
        <CardTable
          settings={settings}
          initialCards={CardDefinition}
          windows={[
            <Help
              key={'helpVisible'}
              hideHelp={() => {
                setSettings('helpVisible', false)
              }}
            />,
            <SettingsPanel
              key={'settingsVisible'}
              hideSettings={() => {
                setSettings('settingsVisible', false)
              }}
            />
          ]}
        />
      </DndProvider>
      <Footer setSettings={setSettings} />
    </div>
  )
}

export default App
