import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Match from './components/Match';
import "./Profile.css"

const Pagination = ({ currentPage, onPageChange }) => {
  const pageLim = 10;

  const handlePageClick = (page) => {
    if (page < 1 || page > pageLim) return;
    onPageChange(page);
  };

  return (
    <div className="pagination-container">
      <button
        onClick={() => handlePageClick(currentPage - 1)}
        disabled={currentPage === 1}
        className="page-item"
      >
        &lt;
      </button>
      {[...Array(pageLim)].map((_, index) => {
        const pageNumber = index + 1;
        return (
          <button
            key={pageNumber}
            onClick={() => handlePageClick(pageNumber)}
            className={`page-item ${currentPage === pageNumber ? 'active' : ''}`}
          >
            {pageNumber}
          </button>
        );
      })}
      <button 
        onClick={() => handlePageClick(currentPage + 1)} 
        disabled={currentPage === pageLim}
        className="page-item"
      >
        &gt;
      </button>
    </div>
  );
};

const Profile = () => {
  const { region, gameName, tagLine } = useParams(); // Extracts URL params

  const [ summonerData, setSummonerData ] = useState(null)
  const [ isLoading, setLoading ] = useState(false)
  const [ error, setError ] = useState(null)
  const [ detailedMatches, setDetailedMatches] = useState(null)
  const [ currentPage, setCurrentPage ] = useState(1)

  useEffect(() => {
    const fetchAllPlayerData = async () => {
      // Reset data and begin loading
      setSummonerData(null)
      setDetailedMatches(null)
      setLoading(true)
      setError(null)

      // Fetch summoner data (puuid) and match IDs
      try {
        const start = (currentPage - 1) * 20;
        const lookupResponse = await fetch('/api/lookup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ region, gameName, tagLine, start }), // Convert vars to JSON strings
        });
  
        if (!lookupResponse.ok) {
          const errorData = await lookupResponse.json();
          throw new Error(errorData.detail || `HTTP error: ${lookupResponse.status}`);
        }
        
        const lookupData = await lookupResponse.json();
        setSummonerData(lookupData);
        
        // Fetch match details using IDs from lookup IF lookup is valid
        if (lookupData.match_ids && lookupData.match_ids.length > 0) {
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
        } else {
          setDetailedMatches([]);
        }
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
  }, [region, gameName, tagLine, currentPage]); // Re-run effect if the user in the URL changes

  /* Reset to page 1 when user searches for a new player */
  useEffect(() => {
    setCurrentPage(1);
  }, [region, gameName, tagLine]);

  if (isLoading) {
    return <div>Loading profile...</div>;
  }

  return (
    <div>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <h1>Profile for {region}/{gameName}#{tagLine}</h1>

      {detailedMatches && (
        <div className="match-history">
          <h2>Recent Matches</h2>
          {detailedMatches.length > 0 ? (
            detailedMatches.map(match => (
              <Match
                key={match.metadata.match_id}
                matchData={match}
                puuid={summonerData.puuid}
              />
            ))
          ) : (
            <p>No matches found on this page.</p>
          )}
          <Pagination currentPage={currentPage} onPageChange={setCurrentPage} />
        </div>
      )}
    </div>
  );
};

export default Profile;