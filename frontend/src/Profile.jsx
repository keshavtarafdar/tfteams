import React from 'react';
import { useEffect, useParams } from 'react-router-dom';
import Match from './components/Match';
import SpriteAnimation from './components/SpriteAnimation';
import "./Profile.css"

const ProfileHeader = ({ summonerInfo, gameName, tagLine, matches }) => {
  const getPlacementColor = (placement) => {
    if (placement === 1) return 'first';
    else if (placement <= 4) return 'top-four';
    else return 'bottom-four';
  };

  const placements = matches.map(match => 
    match.info.participants.find(p => p.puuid === summonerInfo.puuid)?.placement
  ).filter(Boolean); /* Removes any undefined values */

  return (
    <div className="profile-header-container">
      <div className="profile-pic">
        <img 
          src={`https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/profile-icons/${summonerInfo.profileIconId}.jpg`}
          alt="Profile Icon"
        />
        <span className="profile-level">{summonerInfo.summonerLevel}</span>
      </div>
      <div className="name-and-stats">
        <h1 className="profile-name">{gameName}<span>#{tagLine}</span></h1>
        <div className="heatmap-container">
          <p>Recent Placements:</p>
          <div className="heatmap-grid">
            {placements.map((placement, index) => (
              <div key={index} className={`heatmap-cell ${getPlacementColor(placement)}`}>
                {placement}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const Pagination = ({ currentPage, onPageChange }) => {
  const pageLim = 10;

  const handlePageClick = (page) => {
    if (page < 1 || page > pageLim) return;
    onPageChange(page);
  };

  return (
    <div className="pagination-container">
      <button /* 'Previous' button, disabled when on page 1 */
        onClick={() => handlePageClick(currentPage - 1)}
        disabled={currentPage === 1}
        className="page-item"
      >
        &lt;
      </button>
      {[...Array(pageLim)].map((_, i) => { /* Runs pageLim times to generate buttons */
        const pageNumber = i + 1;
        return (
          <button
            key={pageNumber} /* Required by React for lists */
            onClick={() => handlePageClick(pageNumber)}
            /* Designates a page as active if we're on it -- allows different styling */
            className={`page-item ${currentPage === pageNumber ? 'active' : ''}`}
          >
            {pageNumber}
          </button>
        );
      })}
      <button  /* 'Next' button, disabled when on page 10 */
        onClick={() => handlePageClick(currentPage + 1)} 
        disabled={currentPage === pageLim}
        className="page-item"
      >
        &gt;
      </button>
    </div>
  );
};

const Profile = ({ summonerData, detailedMatches, error, currentPage, onPageChange, fetchAllPlayerData }) => {
  const { region, gameName, tagLine } = useParams(); // Extracts URL params

  // Handle users directly navigating to a profile URL
  // (manually trigger fetch)
  useEffect(() => {
    if (!summonerData) {
      fetchAllPlayerData(region, gameName, tagLine, currentPage);
    }
  }, [summonerData, fetchAllPlayerData, region, gameName, tagLine, currentPage]);

  // Display loading animation in the middle of the page
  if (!summonerData || !detailedMatches) {
    return (
      <div style={{ 
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
      }}>
          <SpriteAnimation />
      </div>
    );
  }

  return (
    <div>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <ProfileHeader
        summonerInfo={summonerData}
        gameName={gameName}
        tagLine={tagLine}
        matches={detailedMatches}
      />

      <div className="match-history">
        <h2>Match History</h2>
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
        <Pagination currentPage={currentPage} onPageChange={onPageChange} />
      </div>
    </div>
  );
};

export default Profile;