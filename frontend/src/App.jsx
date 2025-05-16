import { useState, useEffect } from 'react';
import './App.css';

import SearchBar from "./components/SearchBar";

function App() {
  // const [msg, setMsg] = useState('Loading...')

  // useEffect(() => {
  //   fetch('/api/ping')
  //     .then(res => res.json())
  //     .then(data => setMsg(data.message))
  // }, [])

  return (
    <div className="app">
      <div className="search-bar-container">
        <SearchBar />
      </div>
      {/*
        <h1>{msg}</h1>
      */}
    </div>
  );
}

export default App;