import React from 'react'
import { Footer } from './components/Footer'
import { Help } from './components/Help'
import { useSettings } from './hooks/useSettings'
import { SettingsPanel } from './components/SettingsPanel'
import { Draggable } from './components/Draggable'
import { CardBoard } from './components/CardBoard'
import './App.css'

function App() {
  const [settings, setSettings] = useSettings()

  return (
    <div className="App">
      <div className="card-table">
        { settings.settingsVisible && (
          <Draggable zIndex={999999}>
            <SettingsPanel
              settings={settings}
              setSettings={setSettings}
              hideSettings={() => {
                setSettings('settingsVisible', false)
              }}
            />
          </Draggable>
        )}
        { settings.helpVisible && (
          <Draggable zIndex={999999}>
            <Help
              hideHelp={() => {
                setSettings('helpVisible', false)
              }}
            />
          </Draggable>
        )}
        <CardBoard />
      </div>
      <Footer setSettings={setSettings} />
    </div>
  )
}

export default App
