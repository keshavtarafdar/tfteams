import React from 'react';

const Match = ({ matchData, puuid }) => {
  const player = matchData.info.participants.find(p => p.puuid === puuid);

  if (!player) {
    return <div>Error loading match data for player.</div>;
  }

  return (
    <div className="match-card">
      <div className="placement">
        <h2>{player.placement}</h2>
      </div>
      <div className="units">
        {player.units.map(unit => (
          <div key={unit.character_id} className="unit">
            const champ_name = unit.character_id.split('_')[1].toLowerCase();
            <img src={`/champions/${champ_name}.jpg`} alt={unit.character_id} />
            {/* Render items, stars, etc. */}
          </div>
        ))}
      </div>
      {/* Add traits, game length, other players, etc. */}
    </div>
  );
};

export default Match;