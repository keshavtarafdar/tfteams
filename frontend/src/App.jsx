import { useState, useEffect } from 'react'
import './App.css'

import SearchBar from "./components/SearchBar"

function App() {

  getSummoner = (gameName, tagLine) => {
    
  }

  return (
    <div className="app">
      <div className="search-bar-container">
        <SearchBar 
          placeholder="Game Name#tag"
          onSubmit={getSummoner}
        />
      </div>
    </div>
  );
}

export default App