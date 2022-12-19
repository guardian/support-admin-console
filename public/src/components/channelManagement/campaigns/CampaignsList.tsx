import React from 'react';
import { List, ListItem, Theme, makeStyles, Button, Typography } from '@material-ui/core';
import { red } from '@material-ui/core/colors';
import { Campaigns, Campaign, unassignedCampaign } from './CampaignsForm';

const useStyles = makeStyles(({ palette }: Theme) => ({
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
  live: {
    border: `1px solid ${red[500]}`,

    '&:hover': {
      background: `${red[500]}`,
      text: 'white',
    },
  },
  liveInverted: {
    background: `${red[500]}`,
    text: 'white',
  },
  draft: {
    border: `1px solid ${palette.grey[700]}`,

    '&:hover': {
      background: `${palette.grey[700]}`,
      text: 'white',
    },
  },
  draftInverted: {
    background: `${palette.grey[700]}`,
    text: 'white',
  },
}));

interface CampaignsListProps {
  campaigns: Campaigns;
  campaignSearch: string;
  selectedCampaign?: Campaign;
  onCampaignSelected: (testName: string) => void;
}

const CampaignsList = ({
  campaigns,
  campaignSearch,
  selectedCampaign,
  onCampaignSelected,
}: CampaignsListProps): React.ReactElement => {
  const classes = useStyles();

  const getAppropriateStylingForCampaign = (c: Campaign | undefined) => {
    if (c == null) {
      return classes.button;
    }
    const containerClasses = [classes.button];
    const isActive = c.isActive ?? true;
    const isCurrent = selectedCampaign != null ? c.name === selectedCampaign.name : false;

    if (isActive && isCurrent) {
      containerClasses.push(classes.liveInverted);
    } else if (isCurrent) {
      containerClasses.push(classes.draftInverted);
    } else if (isActive) {
      containerClasses.push(classes.live);
    } else {
      containerClasses.push(classes.draft);
    }
    return containerClasses.join(' ');
  };

  const filterCampaigns = (campaignArray: Campaigns) => {
    return campaignArray.filter(c => {
      if (!campaignSearch) {
        return true;
      } else if (c.nickname && c.nickname.indexOf(campaignSearch) >= 0) {
        return true;
      } else if (c.name.indexOf(campaignSearch) >= 0) {
        return true;
      }
      return false;
    });
  };

  const sortCampaigns = (campaignArray: Campaigns) => {
    campaignArray.sort((a, b) => {
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
    return campaignArray;
  };

  const sortedCampaigns = sortCampaigns(filterCampaigns(campaigns));

  return (
    <div className={classes.container}>
      <List className={classes.list}>
        {sortedCampaigns.map(campaign => (
          <ListItem className={classes.listItem} key={campaign.name}>
            <Button
              className={getAppropriateStylingForCampaign(campaign)}
              variant="outlined"
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
            className={getAppropriateStylingForCampaign(unassignedCampaign)}
            variant="outlined"
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
