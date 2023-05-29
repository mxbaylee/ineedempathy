import React from 'react'
import './Help.css'

export interface HelpProps {
  hideHelp: () => void
}

export const Help = (props: HelpProps) => {
  return (
    <div className="help">
      <div className="title">
        <h3>I Need HELP 😢</h3>
      </div>
      <div onClick={props.hideHelp} className="close">
        ❌
      </div>
      <div className="content">
        <h4>How to use the virtual cards</h4>
        <p>
          To use the virtual cards, simply drag and arrange them to your
          liking. You can also flip the cards over to see the other side.
        </p>
        <ul>
          <li>
            To drag a card, simply click and hold on the card and then move your
            mouse or finger.
          </li>
          <li>To arrange the cards, simply drag them to the desired location.</li>
          <li>To flip a card over, simply click on the card.</li>
        </ul>
        <h4>Identify 💖 Feelings and ☀️ Needs</h4>
        <p>
          The virtual cards can be used to identify feelings and needs that you
          may be experiencing. To do this, simply look through the cards and see
          if any of them resonate with you. If a card does resonate with you,
          take a moment to reflect on what the card means to you.
        </p>
      </div>
    </div>
  )
}
