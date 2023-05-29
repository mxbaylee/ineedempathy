import React from 'react'

export interface SettingsPanelProps {
  hideSettings: () => void
}

export const SettingsPanel = ({ hideSettings }: SettingsPanelProps) => {
  return (
    <div className="settings">
      Settings!! 😀
    </div>
  )
}
