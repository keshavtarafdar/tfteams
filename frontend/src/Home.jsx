import React from 'react';
import SpriteAnimation from './components/SpriteAnimation';
import SearchBar from './components/SearchBar';
import './Home.css'

const Home = ({ handleSearch, isLoading }) => {
  return (
    <div className="search-bar-container">
      <h1>TFTeams</h1>
      <SearchBar 
        placeholder="Region/Game Name#Tag"
        // SearchBar's handleSubmit validates input, then calles handleSearch
        onSubmit={handleSearch}
      />
      {isLoading && ( // Render the animation when loading
        <div className="loading-container">
          <SpriteAnimation />
        </div>
      )}
    </div>
  );
};

export default Home;