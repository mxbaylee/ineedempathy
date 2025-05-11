import React, { CSSProperties, useState } from 'react'
import { Footer } from './components/Footer'
import { Help } from './components/Help'
import { getCardSizeScale, useSettings } from './hooks/useSettings'
import { SettingsPanel } from './components/SettingsPanel'
import { InfoPanel } from './components/InfoPanel'
import { ContainedDraggable } from './components/ContainedDraggable'
import { CardTable } from './components/CardTable'
import './App.css'

function App() {
  const [settings, setSettings] = useSettings();

  const [settingsVisible, setSettingsVisible] = useState(false);
  const [helpVisible, setHelpVisible] = useState(false);
  const [infoVisible, setInfoVisible] = useState(false);

  return (
    <>
    <div
      className="App"
      style={{
        '--card-ratio': getCardSizeScale(settings.cardSize),
      } as CSSProperties}
    >
      <div className="card-table">
        { infoVisible && (
          <ContainedDraggable>
            <InfoPanel
              hideInfo={() => {
                setInfoVisible(false);
              }}
            />
          </ContainedDraggable>
        )}
        { settingsVisible && (
          <ContainedDraggable>
            <SettingsPanel
              settings={settings}
              setSettings={setSettings}
              hideSettings={() => {
                setSettingsVisible(false);
              }}
            />
          </ContainedDraggable>
        )}
        { helpVisible && (
          <ContainedDraggable>
            <Help
              hideHelp={() => {
                setHelpVisible(false);
              }}
            />
          </ContainedDraggable>
        )}
        <CardTable cardSize={settings.cardSize} />
      </div>
    </div>
    <Footer
      openHelp={() => {
        setHelpVisible(true);
      }}
      openSettings={() => {
        setSettingsVisible(true);
      }}
      openInfo={() => {
        setInfoVisible(true);
      }}
    />
    </>
  )
}

export default App
