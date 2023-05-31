import React, { useRef } from 'react'
import { Footer } from './components/Footer'
import { CardDefinitions } from './CardDefinitions'
import { Help } from './components/Help'
import { useSettings } from './hooks/useSettings'
import { SettingsPanel } from './components/SettingsPanel'
import { Card } from './components/Card'
import { Draggable } from './components/Draggable'
import { WrappedCardProps, PrettyFormatter } from './formatters/PrettyFormatter'
import './App.css'

function App() {
  const zIndexRef = useRef(1)
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
        {PrettyFormatter(CardDefinitions).map(([card, pos]: WrappedCardProps, idx: number) => {
          return (
            <Draggable
              zIndexRef={zIndexRef}
              initialTop={pos.top}
              initialLeft={pos.left}
            >
              <Card
                {...card}
                volume={settings.volume}
                initialFlipped={false}
              />
            </Draggable>
          )
        })}
      </div>
      <Footer setSettings={setSettings} />
    </div>
  )
}

export default App
