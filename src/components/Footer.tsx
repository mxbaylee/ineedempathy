import React from 'react';
import './Footer.css';

export interface FooterProps {
}

export const Footer = (props: FooterProps) => {
  return (
    <footer className="footer">
      <a href="https://github.com/mxbaylee/ineedempathy" className="nav-link text-muted" rel="noreferrer" target="_blank">GitHub</a>
      <a href="about:blank" className="nav-link text-muted" rel="noreferrer" target="_blank">Help</a>
    </footer>
  )
}
