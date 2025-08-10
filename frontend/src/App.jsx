import { useState } from 'react'
import { Router, Route, Switch} from 'react-router-dom'
import HomePage from './pages/HomePage'
import ProfilePage from './pages/ProfilePage'
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
      <Router>
        <Switch>
          <Route path="/" element={<Home />} />
          <Route path="/profile/:region/:gameName/:tagLine" element={<Profile />} /> 
        </Switch>
      </Router>
    </div>
  );
}

export default App