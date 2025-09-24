import { makeStyles } from '@mui/styles';
import { Theme } from '@mui/material';
import React from 'react';
import PromoCampaignsSidebar from './promoCampaignsSidebar';
import {
  dummyCampaigns,
  dummyCreatePromoCampaignFunction,
  dummySelectedCampaign,
  dummySelectedPromoCampaignFunction,
} from './utils/promoModels';

const useStyles = makeStyles(({ spacing, typography }: Theme) => ({
  viewTextContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: '-50px',
  },
  viewText: {
    fontSize: typography.pxToRem(16),
  },
  body: {
    display: 'flex',
    overflow: 'hidden',
    flexGrow: 1,
    width: '100%',
    height: '100%',
  },
  headline2: {
    color: '#555',
    fontSize: 18,
  },
  leftCol: {
    height: '100%',
    flexShrink: 0,
    overflowY: 'auto',
    background: 'white',
    paddingTop: spacing(6),
    paddingLeft: spacing(6),
    paddingRight: spacing(6),
  },
  rightCol: {
    flexGrow: 1,
    display: 'flex',
    justifyContent: 'center',
  },
}));

const PromoTool: React.FC = () => {
  const classes = useStyles();

  return (
    <div className={classes.body}>
      {/* TODO: there should probably be a form rather than a div */}
      <div className={classes.leftCol}>
        <PromoCampaignsSidebar
          promoCampaigns={dummyCampaigns}
          selectedPromoCampaign={dummySelectedCampaign}
          createPromoCampaign={dummyCreatePromoCampaignFunction}
          onPromoCampaignSelected={dummySelectedPromoCampaignFunction}
        />
      </div>
      <div className={classes.rightCol}>
        {' '}
        <h2 className={classes.headline2}>List of Promos for campaign</h2>
      </div>
    </div>
  );
};

export default PromoTool;
