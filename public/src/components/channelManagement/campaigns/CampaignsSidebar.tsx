import React, { useState } from 'react';
import { makeStyles, Typography, Button } from '@material-ui/core';
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
  button: {
    justifyContent: 'start',
    height: '48px',
  },
  text: {
    fontSize: '12px',
    fontWeight: 500,
    textTransform: 'uppercase',
    letterSpacing: '1px',
  },
}));

interface CampaignsSidebarProps {
  campaigns: Campaigns;
  selectedCampaignName: string | null;
  createCampaign: (campaign: Campaign) => void;
  onCampaignSelected: (campaignName: string) => void;
  saveAllCampaigns: () => void;
}

function CampaignsSidebar({
  campaigns,
  createCampaign,
  selectedCampaignName,
  onCampaignSelected,
  saveAllCampaigns,
}: CampaignsSidebarProps): React.ReactElement {
  console.log('LOADING CampaignsSidebar', campaigns);
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
      <Typography >The requirement to<br />have this button is<br />needlessly bad UX -<br />a newly created campaign<br />should automatically be<br />saved into S3!</Typography>
      <div className={classes.buttonsContainer}>
        <Button
          className={classes.button}
          variant="outlined"
          onClick={saveAllCampaigns}
        >
          <Typography className={classes.text}>Save all campaigns</Typography>
        </Button>
      </div>
    </div>
  );
}

export default CampaignsSidebar;
