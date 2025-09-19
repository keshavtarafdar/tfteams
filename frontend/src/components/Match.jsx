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
        {player.units.map(unit => {
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
                unit.itemNames && unit.itemNames.map(item => {
                  let itemParts = item.split('_')
                  let itemPath = (itemParts.length > 1 ? itemParts[itemParts.length - 1] : item).toLowerCase();
                  <img
                    key={item}
                    src={`/items/${itemPath}.png`} 
                    alt={item}
                    className="item-icon"
                  />
                })
              }
            </div>
          </div>
        })}
      </div>
    </div>
  );
};

export default Match;