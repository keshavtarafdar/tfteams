import React from 'react';

const Match = ({ matchData, puuid }) => {
  const player = matchData.info.participants.find(p => p.puuid === puuid);

  if (!player) {
    return <div>Error loading match data for player.</div>;
  }

  return (
    <div className="match-card">
      <div className="placement">
        <h2>#{player.placement}</h2>
      </div>
      <div className="units">
        {player.units.map(unit => (
          <div key={unit.character_id} className="unit">
            <img src={`../assets/champions/${unit.character_id.slice(6)}.jpg`} alt={unit.character_id} />
            {/* Render items, stars, etc. */}
          </div>
        ))}
      </div>
      {/* Add traits, game length, other players, etc. */}
    </div>
  );
};

export default Match;