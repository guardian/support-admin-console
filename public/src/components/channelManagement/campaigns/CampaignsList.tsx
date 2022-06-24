import React from 'react';
import { List, ListItem, Theme, makeStyles, Button, Typography } from '@material-ui/core';
import { Campaigns, Campaign } from './CampaignsForm';

const useStyles = makeStyles(({}: Theme) => ({
  container: {
    marginTop: '16px',
  },
  list: {
    padding: 0,
    width: '100%',
  },
  listItem: {
    margin: 0,
    padding: 0,
    gutter: 0,
    width: '100%',
  },
  button: {
    position: 'relative',
    height: '50px',
    width: '290px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    background: 'white',
    borderRadius: '4px',
    padding: '0 12px',
    marginBottom: '4px',
  },
  text: {
    fontSize: '12px',
    fontWeight: 500,
    textTransform: 'uppercase',
    letterSpacing: '1px',
  },
}));

interface CampaignsListProps {
  campaigns: Campaigns;
  selectedCampaign?: Campaign;
  onCampaignSelected: (testName: string) => void;
}

const CampaignsList = ({
  campaigns,
  selectedCampaign,
  onCampaignSelected,
}: CampaignsListProps): React.ReactElement => {
  const classes = useStyles();

  const checkIfCampaignIsSelected = (): 'outlined' => {
    if (selectedCampaign) {
      return 'outlined';
    }
    return 'outlined';
  };

  return (
    <div className={classes.container}>
      <List className={classes.list}>
        {campaigns.map(campaign => (
          <ListItem className={classes.listItem} key={campaign.name}>
            <Button
              className={classes.button}
              variant={checkIfCampaignIsSelected()}
              onClick={(): void => onCampaignSelected(campaign.name)}
            >
              <Typography className={classes.text}>{campaign.nickname}</Typography>
            </Button>
          </ListItem>
        ))}
      </List>
    </div>
  );
};

export default CampaignsList;
