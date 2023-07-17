import { useCallback, useState } from 'react'

export interface SettingsItems {
  volume: number
  cardSize: number
  helpVisible: boolean
  settingsVisible: boolean
  infoVisible: boolean
}

export type SettingsHookReturn = [
  SettingsItems,
  (key: string, value: any) => void
]

export const SETTINGS_KEY = 'empatySettingsKey'

export const useSettings = (): SettingsHookReturn => {
  let parsedSettings
  try {
    parsedSettings = {
      ...JSON.parse(localStorage.getItem(SETTINGS_KEY) || ''),
      settingsVisible: false,
      helpVisible: false,
    }
  } catch (e) {}
  const defaultSettings = parsedSettings || {
    volume: 2,
    cardSize: (window.innerWidth <= 900 || window.innerHeight <= 400) ? 5 : 7,
    settingsVisible: false,
    helpVisible: false,
    infoVisible: false,
  }
  const [settings, _setSettings] = useState<SettingsItems>(defaultSettings)

  const setSettings = useCallback((key: string, value: any): void => {
    const newSettings = {
      ...settings,
      [key]: value,
    }
    _setSettings(newSettings)
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(newSettings));
  }, [settings, _setSettings])

  return [settings, setSettings]
}
