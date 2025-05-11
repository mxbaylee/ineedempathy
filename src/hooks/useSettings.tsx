import { useEffect, useCallback, useState } from 'react'

export interface SettingsItems {
  volume: number;
  cardSize: CardSize;
};

export enum Breakpoint {
  SMALL = 640,
  MEDIUM = 769,
  LARGE = 1024,
}

export enum CardSize {
  SMALL = 'Small',
  MEDIUM = 'Medium',
  LARGE = 'Large',
}

export const getSizeLabel = (size: number) => {
  switch (size) {
    case 5: return 'Small'
    case 7: return 'Medium'
    case 9: return 'Large'
    default: return size.toString()
  }
}

const calculateDefaultCardSize = (): CardSize => {
  const width = window.innerWidth;
  if (width <= Breakpoint.SMALL) {
    return CardSize.SMALL;
  }
  return CardSize.MEDIUM;
};

export const getCardSizeScale = (cardSize: CardSize): number => {
  return (
    cardSize === CardSize.SMALL ? 5 : cardSize === CardSize.MEDIUM ? 7 : 9
  ) / 10;
};

export type SettingsHookReturn = [
  SettingsItems,
  (key: string, value: any) => void
];

export const SETTINGS_KEY = 'empathySettings';

const parseSettings = (): SettingsItems | false => {
  try {
    const parsed = JSON.parse(localStorage.getItem(SETTINGS_KEY) || '');
    return {
      ...parsed,
      cardSize: parsed.cardSize as CardSize
    }
  } catch (e) {
    return false;
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
    cardSize: calculateDefaultCardSize(),
  })

  useEffect(() => {
    const callback = () => {
      const newSettings = parseSettings()
      if (newSettings && areSettingsDifferent(newSettings, settings)) {
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
