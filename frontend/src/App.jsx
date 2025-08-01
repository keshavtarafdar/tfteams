import { useState } from 'react'
import './App.css'
import SearchBar from "./components/SearchBar"

function App() {
  const [ summonerData, setSummonerData ] = useState(null)
  const [ isLoading, setLoading ] = useState(false)
  const [ error, setError ] = useState(null)

  const getSummoner = async (gameName, tagLine) => {
    // Reset data and begin loading
    setSummonerData(null)
    setLoading(true)
    setError(null)

    console.log("Searching for:", gameName, tagLine)

    try {
      const response = await fetch('/api/lookup', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ gameName, tagLine }), // Convert vars to JSON strings
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || `HTTP error: ${response.status}`);
      }
      setSummonerData(await response.json())
    } catch (error) {
      setError(error.message)
      console.log("Failed to fetch summoner:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="app">
      <div className="search-bar-container">
        <SearchBar
          placeholder="Game Name#tag"
          // SearchBar's handleSubmit splits the input and then calls getSummoner with both parts
          onSubmit={getSummoner}
        />
        {isLoading && <p>Loading...</p>}
        {error && <p style={{ color: 'red' }}>Error: {error}</p>}
        {summonerData && (
          <div>
            <h2>Summoner Found!</h2>
            <pre>{JSON.stringify(summonerData, null, 2)}</pre>
          </div>
        )}
      </div>
    </div>
  );
}

export default App