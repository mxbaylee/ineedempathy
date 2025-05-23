import React from 'react'
import './css/Panel.css'

export interface InfoPanelProps {
  hideInfo: () => void
}

export const InfoPanel = ({ hideInfo }: InfoPanelProps) => {
  return (
    <div className="settings panel">
      <div className="banner">
        <div onClick={hideInfo} className="close">
          ❌
        </div>
        <div className="title">
          <h3>🌈 Website Information</h3>
        </div>
      </div>
      <div className="content">
        <p>Feeling and Needs Card Designs</p>
        <p>Copyright (c) 2020 Susana Castro</p>
        <p>Licensed under a Creative Commons Attribution 4.0 International License.</p>
        <p><a target="_blank" rel="noreferrer" href="https://instagram.com/susdraws/">instagram</a></p>
        <hr />
        <p>Website and Concept</p>
        <p>Copyright (c) 2023 Baylee Schmeisser</p>
        <p>MIT License</p>
        <p><a target="_blank" rel="noreferrer" href="https://github.com/mxbaylee/ineedempathy">Code Available on &lt;GitHub&gt;</a></p>
        <p>Email Me: <a target="_blank" rel="noreferrer" href="mailto:ineedempathy@privaterelay.baylee.dev">ineedempathy@baylee.dev</a></p>
      </div>
    </div>
  )
}
