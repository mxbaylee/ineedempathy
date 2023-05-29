import React from 'react';
import './Footer.css';

export interface FooterProps {
  setPreferences: (key: string, value: any) => void
}

export const Footer = (props: FooterProps) => {
  const openHelp = (e: any) => {
    e.preventDefault()
    props.setPreferences('helpVisible', true)
  }
  const openSettings = (e: any) => {
    e.preventDefault()
    props.setPreferences('settingsVisible', true)
  }
  return (
    <footer className="footer">
      <a href="https://github.com/mxbaylee/ineedempathy" className="nav-link text-muted" rel="noreferrer" target="_blank">GitHub</a>
      <a onClick={openSettings} href="about:blank" className="nav-link text-muted" rel="noreferrer" target="_blank">Settings</a>
      <a onClick={openHelp} href="about:blank" className="nav-link text-muted" rel="noreferrer" target="_blank">Help</a>
    </footer>
  )
}
