import React from 'react';
import { List, ListItem, Theme, makeStyles, Button, Typography } from '@material-ui/core';
import { red } from '@material-ui/core/colors';
import { Campaigns } from './CampaignsForm';
import useHover from '../../../hooks/useHover';

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
    justifyContent: 'start',
    margin: 0,
    padding: '8px',
    marginBottom: '4px',
    width: '100%',
  },
  text: {
    fontSize: '12px',
    fontWeight: 500,
    textTransform: 'uppercase',
    letterSpacing: '1px',
  },
  // live: {
  //   border: `1px solid ${red[500]}`,

  //   '&:hover': {
  //     background: `${red[500]}`,
  //   },
  // },
  // liveInverted: {
  //   background: `${red[500]}`,
  // },
  // draft: {
  //   border: `1px solid ${palette.grey[700]}`,

  //   '&:hover': {
  //     background: `${palette.grey[700]}`,
  //   },
  // },
  // draftInverted: {
  //   background: `${palette.grey[700]}`,
  // },
}));

interface CampaignsListProps {
  campaigns: Campaigns;
  selectedCampaignName: string | null;
  onCampaignSelected: (testName: string) => void;
}

const CampaignsList = ({
  campaigns,
  selectedCampaignName,
  onCampaignSelected,
}: CampaignsListProps): React.ReactElement => {
  const classes = useStyles();

  return (
    <div className={classes.container}>
      <List className={classes.list}>
        {campaigns.map((campaign, index) => (
          <ListItem className={classes.listItem} key={campaign.name}>
            <Button
              className={classes.button}
              variant="outlined"
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
