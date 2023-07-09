import React, { useRef, useState } from 'react'
import { Footer } from './components/Footer'
import { CardDefinitions } from './CardDefinitions'
import { Help } from './components/Help'
import { useSettings } from './hooks/useSettings'
import { SettingsPanel } from './components/SettingsPanel'
import { Draggable } from './components/Draggable'
import { CardGroupItem, PrettyFormatter } from './formatters/PrettyFormatter'
import { CardGroup } from './components/CardGroup'
import { CardPropsBase } from './components/Card'
import './App.css'

function App() {
  const zIndexRef = useRef(1)
  const [cardGroups, setCardGroups] = useState<CardGroupItem[]>(
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
        <>
          {cardGroups.map((cardGroup: CardGroupItem, idx: number) => {
            const setCards = (cards: CardPropsBase[]) => {
              const newCardGroupItems = cardGroups.slice()
              newCardGroupItems[idx] = {
                ...newCardGroupItems[idx],
                cards: cards,
              }
              setCardGroups(newCardGroupItems)
            }
            return (
              <CardGroup
                zIndexRef={zIndexRef}
                cardGroup={cardGroup}
                settings={settings}
                setCards={setCards}
              />
            )
          })}
        </>
      </div>
      <Footer setSettings={setSettings} />
    </div>
  )
}

export default App
