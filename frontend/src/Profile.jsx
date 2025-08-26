import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const Profile = () => {
  const { region, gameName, tagLine } = useParams(); // Extracts URL params

  const [ summonerData, setSummonerData ] = useState(null)
  const [ isLoading, setLoading ] = useState(false)
  const [ error, setError ] = useState(null)

  useEffect(() => {
    const fetchAllPlayerData = async () => {
      // Reset data and begin loading
      setSummonerData(null)
      setLoading(true)
      setError(null)

      try {
        const response = await fetch('/api/lookup', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ region, gameName, tagLine }), // Convert vars to JSON strings
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

    };

    fetchAllPlayerData();
  }, [region, gameName, tagLine]); // Re-run effect if the user in the URL changes

  if (isLoading) {
    return <div>Loading profile...</div>;
  }

  return (
    <div>
      <h1>Profile for {region}/{gameName}#{tagLine}</h1>
      
      <pre>{JSON.stringify(summonerData, null, 2)}</pre>

      {summonerData && (
        <div>
          <h2>Recent Matches</h2>
          <ul>
            {summonerData.map(matchId => (
              <li key={matchId}>{matchId}</li>
            ))}
          </ul>
        </div>
      )}

      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
    
  );
};

export default Profile;