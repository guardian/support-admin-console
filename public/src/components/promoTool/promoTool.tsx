import { makeStyles } from '@mui/styles';
import { Theme } from '@mui/material';
import React, { useEffect, useState } from 'react';
import PromoCampaignsSidebar from './promoCampaignsSidebar';
import { dummyCampaigns, PromoCampaign } from './utils/promoModels';
import { useParams } from 'react-router-dom';

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

  const [promoCampaigns, setPromoCampaigns] = useState<PromoCampaign[]>([]);
  const { promoCampaignCode } = useParams<{ promoCampaignCode?: string }>(); // querystring parameter
  const [selectedPromoCampaignCode, setSelectedPromoCampaignCode] = useState<string | undefined>();

  // TODO: replace
  const dummyFetch = () => setPromoCampaigns(dummyCampaigns);
  const onDummyCreate = (newPromoCampaign: PromoCampaign): void => {
    // TODO: validate etc
    setPromoCampaigns([newPromoCampaign, ...promoCampaigns]);
  };

  // set selected promoCampaign
  useEffect(() => {
    if (promoCampaignCode != null) {
      setSelectedPromoCampaignCode(promoCampaignCode);
    }
  }, [promoCampaignCode, promoCampaigns]);

  // fetch promoCampaignsList
  useEffect(() => {
    dummyFetch();
  }, []);

  const selectedPromoCampaign = promoCampaigns.find(
    a => a.campaignCode === selectedPromoCampaignCode,
  );

  return (
    <div className={classes.body}>
      {/* TODO: form rather than a div? */}
      <div className={classes.leftCol}>
        <PromoCampaignsSidebar
          promoCampaigns={promoCampaigns}
          selectedPromoCampaign={selectedPromoCampaign}
          createPromoCampaign={onDummyCreate}
          onPromoCampaignSelected={code => setSelectedPromoCampaignCode(code)}
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
