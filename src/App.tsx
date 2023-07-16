import React, { CSSProperties } from 'react'
import { Footer } from './components/Footer'
import { Help } from './components/Help'
import { useSettings } from './hooks/useSettings'
import { SettingsPanel } from './components/SettingsPanel'
import { InfoPanel } from './components/InfoPanel'
import { ContainedDraggable } from './components/ContainedDraggable'
import { CardTable } from './components/CardTable'
import './App.css'

function App() {
  const [settings, setSettings] = useSettings()

  return (
    <div
      className="App"
      style={{
        '--card-ratio': String(settings.cardSize / 10),
      } as CSSProperties}
    >
      <div className="card-table">
        { settings.infoVisible && (
          <ContainedDraggable zIndex={999999}>
            <InfoPanel
              hideInfo={() => {
                setSettings('infoVisible', false)
              }}
            />
          </ContainedDraggable>
        )}
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
        <CardTable cardSize={settings.cardSize} />
      </div>
      <Footer setSettings={setSettings} />
    </div>
  )
}

export default App
