import React from 'react';
import "./Match.css"

const getSuffix = (placement) => {
  console.log(placement);
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

  return (
    <div className="match-card">
      <div className="placement">
        <h2>{player.placement}{getSuffix(player.placement)}</h2>
      </div>
      <div className="units-container">
        {player.units.map(unit => (
          <div key={unit.character_id} className="unit-portrait">
            <div className="unit-stars">unit.itemNames</div>
            <img src={`/champions/${unit.character_id.split('_')[1].toLowerCase()}.jpg`} alt={unit.character_id} />
            {/* TODO haven't done radiant items or emblems yet, weird names found in the API test calls */}
            <div className="unit-items"></div>
          </div>
        ))}
      </div>
      {/* Add traits, game length, other players, etc. */}
    </div>
  );
};

export default Match;