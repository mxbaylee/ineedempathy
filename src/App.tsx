import React, { useRef, useState } from 'react'
import { Footer } from './components/Footer'
import { CardDefinitions } from './CardDefinitions'
import { Help } from './components/Help'
import { useSettings } from './hooks/useSettings'
import { SettingsPanel } from './components/SettingsPanel'
import { Card, CardPropsBase } from './components/Card'
import { Draggable } from './components/Draggable'
import { CardGroup, PrettyFormatter } from './formatters/PrettyFormatter'
import './App.css'

function App() {
  const zIndexRef = useRef(1)
  const [cardGroups, setCardGroups] = useState(
    PrettyFormatter(CardDefinitions)
  )
  const [settings, setSettings] = useSettings()

  console.log(cardGroups)

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
        {cardGroups.map((cardGroup: CardGroup) => {
          return (
            <Draggable
              zIndexRef={zIndexRef}
              initialTop={cardGroup.top}
              initialLeft={cardGroup.left}
            >
              { cardGroup.cards.map((card: CardPropsBase, idx: number) => {
                return (
                  <Card
                    key={idx}
                    dataIdx={idx}
                    {...card}
                    volume={settings.volume}
                    initialFlipped={cardGroup.flipped || false}
                  />
                )
              }) }
            </Draggable>
          )
        })}
      </div>
      <Footer setSettings={setSettings} />
    </div>
  )
}

export default App
