import { useState, useEffect } from 'react'

export interface SettingsItems {
  volume: number
  isTouchDevice: boolean
  helpVisible: boolean
  settingsVisible: boolean
  infoVisible: boolean
}

export type SettingsHookReturn = [
  SettingsItems,
  (key: string, value: any) => void
]

export const SETTINGS_KEY = 'empatySettings'

export const useSettings = (): SettingsHookReturn => {
  const [settings, _setSettings] = useState<SettingsItems>({
    volume: 2,
    isTouchDevice: (
      ('ontouchstart' in window) || (navigator.maxTouchPoints > 0)
    ),
    settingsVisible: false,
    helpVisible: false,
    infoVisible: false,
  })

  useEffect(() => {
    const empathySettings = localStorage.getItem(SETTINGS_KEY);
    if (empathySettings) {
      try {
        const parsedSettings = JSON.parse(empathySettings);
        _setSettings({
          ...parsedSettings,
          settingsVisible: false,
          helpVisible: false,
        });
      } catch (e) {}
    }
  }, []);

  const setSettings = (key: string, value: any): void => {
    _setSettings({
      ...settings,
      [key]: value,
    })
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  }

  return [settings, setSettings]
}
