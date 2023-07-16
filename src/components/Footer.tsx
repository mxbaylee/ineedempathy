import React from 'react';
import './css/Footer.css';

export interface FooterProps {
  setSettings: (key: string, value: any) => void
}

export const Footer = (props: FooterProps) => {
  const openHelp = (e: any) => {
    e.preventDefault()
    props.setSettings('helpVisible', true)
  }
  const openSettings = (e: any) => {
    e.preventDefault()
    props.setSettings('settingsVisible', true)
  }
  const openInfo = (e: any) => {
    e.preventDefault()
    props.setSettings('infoVisible', true)
  }
  return (
    <footer className="footer">
      <a onClick={openInfo} href="about:blank" className="nav-link text-muted" rel="noreferrer" target="_blank">Info</a>
      <a onClick={openSettings} href="about:blank" className="nav-link text-muted" rel="noreferrer" target="_blank">Settings</a>
      <a onClick={openHelp} href="about:blank" className="nav-link text-muted" rel="noreferrer" target="_blank">Help</a>
    </footer>
  )
}
