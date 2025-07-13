import { useState, useEffect } from 'react'
import './App.css'

import SearchBar from "./components/SearchBar"

function App() {

  const getSummoner = (gameName, tagLine) => {
    console.log("Searching for:", gameName, tagLine)
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