import React from 'react'
import { PolyWarClient } from './game/PolyWarClient';

const App = () => (
  <div>
    <PolyWarClient playerID="0" />
    <PolyWarClient playerID="1" />
  </div>
);

export default App;
