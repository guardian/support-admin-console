import React from 'react';
import { makeStyles, Typography, Button } from '@material-ui/core';
import { Campaigns, Campaign } from './CampaignsForm';
import NewCampaignButton from './NewCampaignButton';
import CampaignsList from './CampaignsList';
import { red } from '@material-ui/core/colors';

const useStyles = makeStyles(() => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    paddingLeft: '32px',
  },
  listsContainer: {
    position: 'relative',
    display: 'flex',
    marginTop: '8px',
  },
  buttonsContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    marginBottom: '10px',
  },
  saveAllButton: {
    justifyContent: 'start',
    height: '48px',
  },
  saveAllButtonAlert: {
    justifyContent: 'start',
    height: '48px',
    border: `3px solid ${red[500]}`,
  },
  saveAllButtonText: {
    fontSize: '12px',
    fontWeight: 500,
    textTransform: 'uppercase',
    letterSpacing: '1px',
  },
}));

interface CampaignsSidebarProps {
  campaigns: Campaigns;
  selectedCampaign?: Campaign;
  newCampaignCreated: boolean;
  createCampaign: (campaign: Campaign) => void;
  onCampaignSelected: (campaignName: string) => void;
  saveAllCampaigns: () => void;
}

function CampaignsSidebar({
  campaigns,
  createCampaign,
  selectedCampaign,
  newCampaignCreated,
  onCampaignSelected,
  saveAllCampaigns,
}: CampaignsSidebarProps): React.ReactElement {
  const classes = useStyles();

  console.log(campaigns);

  return (
    <div className={classes.root}>
      <div className={classes.buttonsContainer}>
        <NewCampaignButton
          existingNames={campaigns.map(c => c.name)}
          existingNicknames={campaigns.map(c => c.nickname || '')}
          createCampaign={createCampaign}
        />
        <Button
          className={newCampaignCreated ? classes.saveAllButtonAlert : classes.saveAllButton}
          variant="outlined"
          onClick={saveAllCampaigns}
        >
          <Typography className={classes.saveAllButtonText}>Save all campaigns</Typography>
        </Button>
      </div>
      <div className={classes.listsContainer}>
        <CampaignsList
          campaigns={campaigns}
          selectedCampaign={selectedCampaign}
          onCampaignSelected={onCampaignSelected}
        />
      </div>
    </div>
  );
}

export default CampaignsSidebar;
