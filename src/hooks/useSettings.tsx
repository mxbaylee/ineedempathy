import { useEffect, useCallback, useState } from 'react'

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

const parseSettings = () => {
  try {
    return {
      ...JSON.parse(localStorage.getItem(SETTINGS_KEY) || ''),
      settingsVisible: false,
      helpVisible: false,
    }
  } catch (e) {
    return false
  }
}

const areSettingsDifferent = (settingsOne: SettingsItems, settingsTwo: SettingsItems): boolean => {
  if (settingsOne.volume !== settingsTwo.volume) {
    return true
  }
  if (settingsOne.cardSize !== settingsTwo.cardSize) {
    return true
  }
  return false
}

export const useSettings = (): SettingsHookReturn => {
  const [settings, _setSettings] = useState<SettingsItems>(parseSettings() || {
    volume: 2,
    cardSize: (window.innerWidth <= 900 || window.innerHeight <= 400) ? 5 : 7,
    settingsVisible: false,
    helpVisible: false,
    infoVisible: false,
  })

  useEffect(() => {
    const callback = () => {
      const newSettings = parseSettings()
      if (areSettingsDifferent(newSettings, settings)) {
        _setSettings(newSettings)
      }
    }
    const id = setInterval(callback, 1000)
    return () => {
      clearInterval(id)
    }
  }, [settings, _setSettings])

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
