import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Match from './components/Match';

const Profile = () => {
  const { region, gameName, tagLine } = useParams(); // Extracts URL params

  const [ summonerData, setSummonerData ] = useState(null)
  const [ isLoading, setLoading ] = useState(false)
  const [ error, setError ] = useState(null)
  const [ detailedMatches, setDetailedMatches] = useState(null)

  useEffect(() => {
    const fetchAllPlayerData = async () => {
      // Reset data and begin loading
      setSummonerData(null)
      setDetailedMatches(null)
      setLoading(true)
      setError(null)

      // Fetch summoner data (puuid) and match IDs
      try {
        const lookupResponse = await fetch('/api/lookup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ region, gameName, tagLine }), // Convert vars to JSON strings
        });
  
        if (!lookupResponse.ok) {
          const errorData = await lookupResponse.json();
          throw new Error(errorData.detail || `HTTP error: ${lookupResponse.status}`);
        }
        
        const lookupData = await lookupResponse.json();
        setSummonerData(lookup_data);
        
        // Fetch match details using IDs from lookup
        const detailsResponse = await fetch('/api/match-details', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ match_ids: lookupData.match_ids, region }),
        });

        if (!detailsResponse.ok) {
          const errorData = await detailsResponse.json();
          throw new Error(errorData.detail || `HTTP error: ${detailsResponse.status}`);
        }
        
        const matchDetails = await detailsResponse.json();
        setDetailedMatches(matchDetails);

      } catch(error) {
        setError(error.message);
        console.error("Failed to fetch player data:", error);
      } finally {
        setLoading(false);
      }
    };

    if(gameName && tagLine && region) {
      fetchAllPlayerData();
    }
  }, [region, gameName, tagLine]); // Re-run effect if the user in the URL changes

  if (isLoading) {
    return <div>Loading profile...</div>;
  }

  return (
    <div>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <h1>Profile for {region}/{gameName}#{tagLine}</h1>

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

      {detailedMatches && (
        <div className="match-history">
          <h2>Recent Matches</h2>
          {detailedMatches.map(match => (
            <Match
              key={match.metadata.match_id}
              matchData={match}
              puuid={summonerData.puuid}
            />
          ))}
        </div>
      )}

    </div>

  );
};

export default Profile;