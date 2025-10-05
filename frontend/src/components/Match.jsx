import React from 'react';
import "./Match.css"

const formatTimestamp = (timestamp) => {
  const now = new Date();
  const matchDate = new Date(timestamp);

  const diffSeconds = Math.floor((now-matchDate)/1000);
  const diffDays = Math.floor(diffSeconds/86400);
  const diffWeeks = Math.floor(diffDays/7);
  const diffMonths = Math.floor(diffDays/30);
  const diffYears = Math.floor(diffDays/365);

  if (diffDays < 1) return 'Today';
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  if (diffWeeks < 5) return `${diffWeeks} week${diffWeeks > 1 ? 's' : ''} ago`;
  if (diffMonths < 12) return `${diffMonths} month${diffMonths > 1 ? 's' : ''} ago`;
  return `${diffYears} year${diffYears > 1 ? 's' : ''} ago`;
}

const formatGameDuration = (seconds) => {
  const minutes = Math.floor(seconds/60);
  const remainingSeconds = Math.round(seconds%60);
  return `${minutes}:${String(remainingSeconds).padStart(2, '0')}`;
}

const getGameMode = (queueId) => {
  switch(queueId) {
    case 1100: return 'Ranked';
    case 1090: return 'Normal';
    case 1130: return 'Hyper Roll';
    case 1160: return 'Double Up';
    default: return 'Other';
  }
}

const getSuffix = (placement) => {
  if (placement == '1') {
    return 'st';
  } else if (placement == '2') {
    return 'nd';
  } else if (placement == '3') {
    return 'rd';
  } else {
    return 'th';
  }
}

const Match = ({ matchData, puuid }) => {
  const player = matchData.info.participants.find(p => p.puuid === puuid);

  if (!player) {
    return <div>Error loading match data for player.</div>;
  }

  const { queue_id, game_datetime, game_length } = matchData.info;

  return (
    <div className="match-card">
      <div className="placement">
        <h2>{player.placement}{getSuffix(player.placement)}</h2>
      </div>
      <div className="match-metadata">
        <h4>{getGameMode(queue_id)}</h4>
        <p>{formatTimestamp(game_datetime)}</p>
        <p>{formatGameDuration(game_length)}</p>
      </div>
      <div className="units-container">
        {player.units.map(unit => (
          <div key={unit.character_id} className="unit-wrapper">
            <div className="unit-stars"></div>

            <div className="unit-portrait">
              <img 
                src={`/champions/${unit.character_id.split('_')[1].toLowerCase()}.jpg`}
                alt={unit.character_id}
              />
            </div>

            {/* TODO haven't done radiant items or emblems yet, weird names found in the API test calls */}
            <div className="unit-items">
              {
                /* TODO "emptybag.png" represents a "blank" TG item meaning they died while their 
                TG didn't have anything decided...? Make it render as blank */
                unit.itemNames && unit.itemNames.map(item => {
                  let itemParts = item.split('_')
                  let itemPath = (itemParts.length > 1 ? itemParts[itemParts.length - 1] : item).toLowerCase();
                  return (
                    <img
                      key={item}
                      src={`/items/${itemPath}.png`} 
                      alt={item}
                      className="item-icon"
                    />
                  )
                })
              }
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Match;