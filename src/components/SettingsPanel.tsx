import React, { useCallback } from 'react'
import { SettingsItems, CardSize } from '../hooks/useSettings'
import { useSound } from '../utils'
import './css/Panel.css'

const CARD_SIZES = [CardSize.SMALL, CardSize.MEDIUM, CardSize.LARGE] as const

export interface SettingsPanelProps {
  hideSettings: () => void
  setSettings: (key: string, value: any) => void
  settings: SettingsItems
}

export const SettingsPanel = ({ settings, setSettings, hideSettings }: SettingsPanelProps) => {
  const [playSound] = useSound(settings.volume)

  const handleCardSizeDelta = useCallback((delta: number) => {
    return () => {
      playSound()
      const currentIndex = CARD_SIZES.indexOf(settings.cardSize)
      const nextIndex = Math.max(0, Math.min(CARD_SIZES.length - 1, currentIndex + delta))
      setSettings('cardSize', CARD_SIZES[nextIndex])
    }
  }, [playSound, settings.cardSize, setSettings])

  const handleVolumeDelta = useCallback((delta: number) => {
    return () => {
      playSound()
      const nextVolume = Math.max(0, Math.min(10, settings.volume + delta))
      setSettings('volume', nextVolume)
    }
  }, [playSound, settings, setSettings])

  return (
    <div className="settings panel">
      <div className="banner">
        <div onClick={hideSettings} className="close">
          ❌
        </div>
        <div className="title">
          <h3>Settings Panel 🎛️</h3>
        </div>
      </div>
      <div className="content">
        <div className="item card-size">
          <label className="item-label">Card Size: {settings.cardSize}</label>
          <div className="size-control">
            <div className="size-buttons">
              <span className="option" onClick={handleCardSizeDelta(-1)}>
                ⬇️
              </span>
              <span className="option" onClick={handleCardSizeDelta(1)}>
                ⬆️
              </span>
            </div>
          </div>
        </div>
        <div className="item volume">
          <label className="item-label">Volume: {settings.volume}</label>
          <div className="size-control">
            <div className="size-buttons">
              <span className="option" onClick={handleVolumeDelta(-1)}>
                ⬇️
              </span>
              <span className="option" onClick={handleVolumeDelta(1)}>
                ⬆️
              </span>
            </div>
          </div>
        </div>
        <div className="content info">
          Hit the ⬇️  and ⬆️  buttons to change the settings
        </div>
      </div>
    </div>
  )
}
