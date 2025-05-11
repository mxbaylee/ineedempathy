import React from 'react';
import './css/Footer.css';

export interface FooterProps {
  openHelp: () => void;
  openSettings: () => void;
  openInfo: () => void;
};

export const Footer = (props: FooterProps) => {
  const openHelp = (e: any) => {
    e.preventDefault();
    props.openHelp();
  };
  const openSettings = (e: any) => {
    e.preventDefault();
    props.openSettings();
  };
  const openInfo = (e: any) => {
    e.preventDefault();
    props.openInfo();
  };
  return (
    <footer className="footer">
      <a onClick={openInfo} href="about:blank" className="nav-link text-muted">Info</a>
      <a onClick={openSettings} href="about:blank" className="nav-link text-muted">Settings</a>
      <a onClick={openHelp} href="about:blank" className="nav-link text-muted">Help</a>
    </footer>
  );
};
