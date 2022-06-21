import React, { useState } from 'react';
import { makeStyles, Typography } from '@material-ui/core';
import { Campaigns, Campaign } from './CampaignsForm';
import NewCampaignButton from './NewCampaignButton';
import CampaignsList from './CampaignsList';

const useStyles = makeStyles(() => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    paddingLeft: '32px',
  },
  listsContainer: {
    // position: 'relative',
    // display: 'flex',
    // marginTop: '8px',
  },
  buttonsContainer: {
    // display: 'flex',
    // flexDirection: 'column',
    // gap: '8px',
    // marginBottom: '10px',
  },
}));

interface SidebarProps {
  campaigns: Campaigns;
  selectedCampaignName: string | null;
  createCampaign: (campaign: Campaign) => void;
  onCampaignSelected: (campaignName: string) => void;
}

function Sidebar({
  campaigns,
  createCampaign,
  selectedCampaignName,
  onCampaignSelected,
}: SidebarProps): React.ReactElement {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <div className={classes.buttonsContainer}>
        <NewCampaignButton
          existingNames={campaigns.map(c => c.name)}
          existingNicknames={campaigns.map(c => c.nickname)}
          createCampaign={createCampaign}
        />
      </div>
      <div className={classes.listsContainer}>
        <CampaignsList
          campaigns={campaigns}
          selectedCampaignName={selectedCampaignName}
          onCampaignSelected={onCampaignSelected}
        />
      </div>
    </div>
  );
}

export default Sidebar;
