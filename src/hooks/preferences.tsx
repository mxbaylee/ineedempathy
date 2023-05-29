import { useState } from 'react'

export interface PreferenceItems {
  isTouchDevice?: boolean
  helpVisible?: boolean
  settingsVisible?: boolean
}

export type PreferenceHookReturn = [
  PreferenceItems,
  (key: string, value: any) => void
]

// TODO localStorage
export const usePreferences = (defaults: PreferenceItems = {}): PreferenceHookReturn => {
  const [preferences, _setPreferences] = useState<PreferenceItems>(defaults)
  const setPreferences = (key: string, value: any): void => {
    _setPreferences({
      ...preferences,
      [key]: value,
    })
  }

  return [preferences, setPreferences]
}
