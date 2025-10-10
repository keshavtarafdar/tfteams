import React, { useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Home from './Home';
import Profile from './Profile';
import './App.css';

function App() {
  // React RouterDOM tool that "takes over" navigation between pages
  const navigate = useNavigate();

  const [summonerData, setSummonerData] = useState(null);
  const [detailedMatches, setDetailedMatches] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const fetchAllPlayerData = async (region, gameName, tagLine, page=1) => {
    setIsLoading(true)
    setError(null)

    // Fetch summoner data (puuid) and match IDs
    try {
      const start = (page - 1) * 20;
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
      return true;
    } catch(error) {
      setError(error.message);
      console.error("Failed to fetch player data:", error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // This function is passed in as a prop to Home.jsx 
  const handleSearch = async (region, gameName, tagLine) => {
    setCurrentPage(1); 
    const success = await fetchAllPlayerData(region, gameName, tagLine, 1);
    if (success) {
      navigate(`/profile/${region}/${gameName}/${tagLine}`);
    }
  };

  return (
    <div className="app">
      <Routes>
        <Route 
          path="/" 
          element={
            <Home
              handleSearch={handleSearch}
              isLoading={isLoading}
            />
          } 
        />
        <Route 
          path="/profile/:region/:gameName/:tagLine" 
          element={
            <Profile 
              summonerData={summonerData}
              detailedMatches={detailedMatches}
              error={error}
              currentPage={currentPage}
              onPageChange={setCurrentPage}
              fetchAllPlayerData={fetchAllPlayerData}
            />
          } 
        /> 
      </Routes>
    </div>
  );
};

export default App;