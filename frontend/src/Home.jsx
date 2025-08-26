import React from 'react';
import { useNavigate } from 'react-router-dom';
import SearchBar from './components/SearchBar';

const HomePage = () => {
  const [ summonerData, setSummonerData ] = useState(null)
  const [ isLoading, setLoading ] = useState(false)
  const [ error, setError ] = useState(null)

  const navigate = useNavigate();

  const handleSearch = async (region, gameName, tagLine) => {
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
    
    // Programmatically navigate to the profile page
    navigate(`/profile/${region}/${gameName}/${tagLine}`);
  };

  return (
    <div className="search-bar-container">
      <h1>TFTeams</h1>
      <SearchBar 
        placeholder="Game Name#tag"
        // SearchBar's handleSubmit validates input, then calles handleSearch above
        onSubmit={handleSearch}
      />
      {isLoading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {summonerData && ( 
        <div>
            <h2>Summoner Found!</h2>
            <pre>{JSON.stringify(summonerData, null, 2)}</pre>
        </div>
      )}
    </div>
)};

export default HomePage;