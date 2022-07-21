import React from 'react';
import { List, ListItem, Theme, makeStyles, Button, Typography } from '@material-ui/core';
import { Campaigns, Campaign, unassignedCampaign } from './CampaignsForm';

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

  // When we get creation timestamps, we are thinking of allowing users to sort the list either alphabetically or by most recently created. For now, only the alphabetically sorted version is possible
  const sortedCampaigns = [...campaigns];

  sortedCampaigns.sort((a, b) => {
    const A = a.nickname || a.name;
    const B = b.nickname || b.name;

    if (A < B) {
      return -1;
    }
    if (B < A) {
      return 1;
    }
    return 0;
  });

  return (
    <div className={classes.container}>
      <List className={classes.list}>
        {sortedCampaigns.map(campaign => (
          <ListItem className={classes.listItem} key={campaign.name}>
            <Button
              className={classes.button}
              variant={checkIfCampaignIsSelected()}
              onClick={(): void => onCampaignSelected(campaign.name)}
            >
              <Typography className={classes.text}>
                {campaign.nickname ? campaign.nickname : campaign.name}
              </Typography>
            </Button>
          </ListItem>
        ))}
        <ListItem className={classes.listItem} key={unassignedCampaign.name}>
          <Button
            className={classes.button}
            variant={checkIfCampaignIsSelected()}
            onClick={(): void => onCampaignSelected(unassignedCampaign.name)}
          >
            <Typography className={classes.text}>{unassignedCampaign.nickname}</Typography>
          </Button>
        </ListItem>
      </List>
    </div>
  );
};

export default CampaignsList;
