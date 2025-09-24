import React from 'react';
import { List, ListItem, Button, Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { red } from '@mui/material/colors';
import { PromoCampaign, PromoCampaigns } from './utils/promoModels';

const useStyles = makeStyles(() => ({
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
    width: '100%',
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
  selected: {
    border: `1px solid ${red[500]}`,

    '&:hover': {
      background: `${red[500]}`,
      color: 'white',
    },
  },
  unselected: {
    background: `${red[500]}`,
    color: 'white',

    '&:hover': {
      background: `${red[500]}`,
      color: 'white',
    },
  },
}));

interface PromoCampaignsListProps {
  promoCampaigns: PromoCampaigns;
  promoCampaignSearch: string;
  selectedPromoCampaign?: PromoCampaign;
  onPromoCampaignSelected: (campaignCode: string) => void;
}

const PromoCampaignsList = ({
  promoCampaigns,
  promoCampaignSearch,
  selectedPromoCampaign,
  onPromoCampaignSelected,
}: PromoCampaignsListProps): React.ReactElement => {
  const classes = useStyles();

  const filterPromoCampaigns = (campaignArray: PromoCampaigns) => {
    return campaignArray.filter(c => {
      if (!promoCampaignSearch) {
        return true;
      } else if (c.name && c.name.indexOf(promoCampaignSearch) >= 0) {
        return true;
      } else if (c.name.indexOf(promoCampaignSearch) >= 0) {
        return true;
      }
      return false;
    });
  };

  const sortPromoCampaigns = (campaignArray: PromoCampaigns) => {
    campaignArray.sort((a, b) => {
      const A = a.name;
      const B = b.name;

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

  const sortedPromoCampaigns = sortPromoCampaigns(filterPromoCampaigns(promoCampaigns));

  // TODO: test this later
  const getStyleForSelectedPromoCampaign = (promoCampaign: PromoCampaign) => {
    const classGroup = [classes.button];
    if (promoCampaign.campaignCode === selectedPromoCampaign?.campaignCode) {
      classGroup.push('classes.selected');
    } else {
      classGroup.push('classes.unselelected');
    }
    return classGroup.join(' ');
  };

  return (
    <div className={classes.container}>
      <List className={classes.list}>
        {sortedPromoCampaigns.map(promoCampaign => (
          <ListItem className={classes.listItem} key={promoCampaign.campaignCode}>
            <Button
              key={`${promoCampaign.name}-button`} // TODO: should this be campaignCode?
              className={getStyleForSelectedPromoCampaign(promoCampaign)}
              variant="outlined"
              onClick={(): void => onPromoCampaignSelected(promoCampaign.campaignCode)}
            >
              <Typography className={classes.text}>{promoCampaign.name}</Typography>
            </Button>
          </ListItem>
        ))}
      </List>
    </div>
  );
};

export default PromoCampaignsList;
