import React from 'react'
import { Footer } from './components/Footer'
import { Help } from './components/Help'
import { useSettings } from './hooks/useSettings'
import { SettingsPanel } from './components/SettingsPanel'
import { ContainedDraggable } from './components/ContainedDraggable'
import { CardBoard } from './components/CardBoard'
import './App.css'

function App() {
  const [settings, setSettings] = useSettings()

  return (
    <div className="App">
      <div className="card-table">
        { settings.settingsVisible && (
          <ContainedDraggable zIndex={999999}>
            <SettingsPanel
              settings={settings}
              setSettings={setSettings}
              hideSettings={() => {
                setSettings('settingsVisible', false)
              }}
            />
          </ContainedDraggable>
        )}
        { settings.helpVisible && (
          <ContainedDraggable zIndex={999999}>
            <Help
              hideHelp={() => {
                setSettings('helpVisible', false)
              }}
            />
          </ContainedDraggable>
        )}
        <CardBoard />
      </div>
      <Footer setSettings={setSettings} />
    </div>
  )
}

export default App
