import React, { useEffect, useState, useCallback } from 'react'
import { SettingsItems } from '../hooks/useSettings'
import { useSound } from '../utils'
import './css/SettingsPanel.css'

export interface SettingsPanelProps {
  hideSettings: () => void
  setSettings: (key: string, value: any) => void
  settings: SettingsItems
}

export const SettingsPanel = ({ settings, setSettings, hideSettings }: SettingsPanelProps) => {
  const [flash, setFlash] = useState<string|boolean>(false)
  const [playSound] = useSound(settings.volume)

  const handleCardSizeDelta = useCallback((delta: number) => {
    return () => {
      playSound()
      const nextCardSize = Math.max(5, Math.min(10, settings.cardSize + delta))
      setSettings('cardSize', nextCardSize)
      setFlash('Settings Saved 🧚🏼')
    }
  }, [playSound, settings, setFlash, setSettings])

  const handleVolumeDelta = useCallback((delta: number) => {
    return () => {
      playSound()
      const nextVolume = Math.max(0, Math.min(10, settings.volume + delta))
      setSettings('volume', nextVolume)
      setFlash('Settings Saved 🧚🏼')
    }
  }, [playSound, settings, setFlash, setSettings])

  // Clear the flash after 3 seconds
  useEffect(() => {
    if (!flash) return
    setTimeout(() => {
      setFlash(false)
    }, 3000)
  }, [flash])

  return (
    <div className="settings">
      <div className="title">
        <h3>Settings Panel 🎛️</h3>
      </div>
      <div onClick={hideSettings} className="close">
        ❌
      </div>
      <div className="content">
        <div className="item card-size">
          <label className="item-label">Card Size</label>
          <span onClick={handleCardSizeDelta(-1)}>
            ⬇️
          </span>
          { settings.cardSize > 5 ? (
            <input
              type="range"
              min={0}
              max={10}
              readOnly={true}
              value={settings.cardSize}
            />
          ) : (
            <span className="value">{settings.cardSize}</span>
          ) }
          <span onClick={handleCardSizeDelta(1)}>
            ⬆️
          </span>
        </div>
        <div className="item volume">
          <label className="item-label">Volume</label>
          <span onClick={handleVolumeDelta(-1)}>
            ⬇️
          </span>
          { settings.cardSize > 5 ? (
            <input
              type="range"
              min={0}
              max={10}
              readOnly={true}
              value={settings.volume}
            />
          ) : (
            <span className="value">{settings.volume}</span>
          ) }
          <span onClick={handleVolumeDelta(1)}>
            ⬆️
          </span>
        </div>
        <div className="content info">
          Hit the ⬇️  and ⬆️  buttons to change the settings
        </div>
        {flash && (
          <div className="flash">{flash}</div>
        )}
      </div>
    </div>
  )
}
