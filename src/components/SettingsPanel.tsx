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

  const handleRadioChange = useCallback((e: any) => {
    const { name, value } = e.target
    playSound()
    setSettings(name, !!parseInt(value, 10))
    setFlash('Settings Saved 🧚🏼')
  }, [playSound, setFlash, setSettings])

  const handleVolumeDelta = useCallback((delta: number) => {
    return () => {
      playSound()
      setSettings('volume', settings.volume + delta)
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
        <div className="item touch">
          <label className="item-label">Touch Screen</label>
          <label>
            <input
              type="radio"
              name="isTouchDevice"
              value="1"
              checked={settings.isTouchDevice}
              onChange={handleRadioChange}
            />
            Yes
          </label>
          <label>
            <input
              type="radio"
              name="isTouchDevice"
              value="0"
              checked={!settings.isTouchDevice}
              onChange={handleRadioChange}
            />
            No
          </label>
        </div>
        <div className="item volume">
          <label className="item-label">Volume</label>
          <span onClick={handleVolumeDelta(-1)}>
            ⬇️
          </span>
          <input
            type="range"
            min={0}
            max={10}
            readOnly={true}
            value={settings.volume}
          />
          <span onClick={handleVolumeDelta(1)}>
            ⬆️
          </span>
        </div>
        {flash && (
          <div className="flash">{flash}</div>
        )}
      </div>
    </div>
  )
}
