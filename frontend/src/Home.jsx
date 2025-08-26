import React from 'react';
import { useNavigate } from 'react-router-dom';
import SearchBar from './components/SearchBar';

const Home = () => {
  // React RouterDOM tool that "takes over" navigation between pages
  const navigate = useNavigate();

  const handleSearch = async (region, gameName, tagLine) => {
    // Passes search parameters to Profile page for loookup and rendering results
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
    </div>
)};

export default Home;