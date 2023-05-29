import React from 'react';
import './Footer.css';

export interface FooterProps {
  setHelpVisible: (value: boolean) => void
}

export const Footer = (props: FooterProps) => {
  const setOpen = (e: any) => {
    e.preventDefault()
    props.setHelpVisible(true)
  }
  return (
    <footer className="footer">
      <a href="https://github.com/mxbaylee/ineedempathy" className="nav-link text-muted" rel="noreferrer" target="_blank">GitHub</a>
      <a onClick={setOpen} href="about:blank" className="nav-link text-muted" rel="noreferrer" target="_blank">Help</a>
    </footer>
  )
}
