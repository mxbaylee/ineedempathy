import { useState } from 'react'

export interface SettingsItems {
  volume: number
  isTouchDevice: boolean
  helpVisible: boolean
  settingsVisible: boolean
}

export type SettingsHookReturn = [
  SettingsItems,
  (key: string, value: any) => void
]

// TODO localStorage
export const useSettings = (defaults: SettingsItems): SettingsHookReturn => {
  const [settings, _setSettings] = useState<SettingsItems>(defaults)
  const setSettings = (key: string, value: any): void => {
    _setSettings({
      ...settings,
      [key]: value,
    })
  }

  return [settings, setSettings]
}
