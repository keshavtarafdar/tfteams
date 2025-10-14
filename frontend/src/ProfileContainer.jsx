import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Profile from './Profile';

const ProfileContainer = ({
  summonerData,
  detailedMatches,
  error,
  currentPage,
  onPageChange,
  fetchPlayerData,
  isLoading
}) => {
  const { region, gameName, tagLine } = useParams();

  // Trigger a fetch on URL change or page change
  useEffect(() => {
    fetchPlayerData(region, gameName, tagLine, currentPage);
  }, [region, gameName, tagLine, currentPage, fetchPlayerData]);

  return (
    <Profile
      summonerData={summonerData}
      detailedMatches={detailedMatches}
      error={error}
      currentPage={currentPage}
      onPageChange={onPageChange}
      isLoading={isLoading}
    />
  );
};

export default ProfileContainer;