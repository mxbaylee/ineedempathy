import React from 'react';
import { Footer } from './components/Footer';
import { CardCategory, CardType, Card } from './components/Card';
import './App.css';

function App() {
  return (
    <>
      <Card
        type={CardType.Feeling}
        category={CardCategory.Meow}
        name="cold"
        definition="Lacking affection or warmth of feeling; unemotional."
        source="https://www.lexico.com/en/definition/cold"
      />
      <Footer />
    </>
  );
}

export default App;
