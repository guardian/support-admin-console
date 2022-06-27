import React, { useState, useEffect } from 'react';
import { Theme, Typography, makeStyles, Button } from '@material-ui/core';
import StickyTopBar from './StickyCampaignBar';
import { Campaign } from './CampaignsForm';
import ChannelCard from './ChannelCard';
import { fetchCampaignTests } from '../../../utils/requests';

const useStyles = makeStyles(({ spacing, palette }: Theme) => ({
  testEditorContainer: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    width: '100%',
    background: palette.background.paper, // #FFFFFF
    borderLeft: `1px solid ${palette.grey[500]}`,
  },
  scrollableContainer: {
    overflowY: 'auto',
    paddingLeft: spacing(3),
    paddingRight: spacing(1),
    paddingTop: spacing(2),
  },
  formContainer: {
    marginBottom: spacing(4),
    borderBottom: '1px solid black',
  },
  notesContainer: {
    marginBottom: spacing(4),
  },
  notesHeader: {
    marginBottom: spacing(2),
    fontSize: '18px',
    fontWeight: 500,
  },
  launchLink: {
    padding: '0 8px',
    fontSize: '14px',
    fontWeight: 'normal',
    color: palette.grey[700],
    lineHeight: 1.5,
    marginBottom: spacing(2),
  },
}));

interface CampaignsEditorProps {
  campaign: Campaign;
}

const testChannelOrder = ['Header', 'Epic', 'EpicHoldback', 'EpicLiveblog', 'EpicAppleNews', 'EpicAMP', 'Banner1', 'Banner2'];

export interface TestChannelItem {
  name: string;
  link: string;
}

export interface TestChannelData {
  [index: string]: TestChannelItem;
}

const testChannelData: TestChannelData = {
  'Header': {
    name: 'Header',
    link: '/header-tests',
  }, 
  'Epic': {
    name: 'Epic',
    link: '/epic-tests',
  }, 
  'EpicHoldback': {
    name: 'Epic Holdback',
    link: '/epic-holdback-tests',
  }, 
  'EpicLiveblog': {
    name: 'Liveblog Epic',
    link: '/liveblog-epic-tests',
  }, 
  'EpicAppleNews': {
    name: 'Apple News Epic',
    link: '/apple-news-epic-tests',
  }, 
  'EpicAMP': {
    name: 'AMP Epic',
    link: '/amp-epic-tests',
  }, 
  'Banner1': {
    name: 'Banner 1',
    link: '/banner-tests',
  }, 
  'Banner2': {
    name: 'Banner 2',
    link: '/banner-tests2',
  }, 
};

function CampaignsEditor({ 
  campaign 
}: CampaignsEditorProps): React.ReactElement {
  const classes = useStyles();

  const [testData, setTestData] = useState<any[]>([]);

  const { name, nickname, description } = campaign;

  useEffect(() => {
    fetchCampaignTests(name).then(tests => {

      // sort by channel
      const sortedTests = tests.sort((a: any, b: any) => {
        return testChannelOrder.indexOf(a.channel) - testChannelOrder.indexOf(b.channel)
      });
      setTestData(sortedTests);
    });
  }, [campaign]);

  return (
    <div className={classes.testEditorContainer}>
      <StickyTopBar name={name} nickname={nickname} />

      <div className={classes.scrollableContainer}>
        <div className={classes.formContainer}>
          <Button
            className={classes.launchLink}
            variant="outlined"
            onClick={() => {}}
            disabled={true}
          >
            Button to open the tests status manager modal - needs to move into sticky bar (top right corner)
          </Button>
          <div className={classes.notesContainer}>
            <div className={classes.notesHeader}>Notes (will be an editable RTE field):</div>
            {description && <Typography>{description}</Typography>}
          </div>
        </div>
        {testChannelOrder.map(channel => (
          <ChannelCard
            channelData={testChannelData[channel]}
            tests={testData.filter(test => test.channel === channel)}
            key={channel}
          />
        ))}
      </div>
    </div>
  );
}

export default CampaignsEditor;
