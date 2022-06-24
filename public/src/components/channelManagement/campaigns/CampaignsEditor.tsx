import React, { useState, useEffect } from 'react';
import { makeStyles, Theme, Typography } from '@material-ui/core';
import StickyTopBar from './StickyCampaignBar';
import { Campaign } from './CampaignsForm';
import { fetchCampaignTests } from '../../../utils/requests';
import { Link } from 'react-router-dom';

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
}));

interface CampaignsEditorProps {
  campaign: Campaign;
}

/*
  The closest we seem to come to a single source of truth for channel names 
  appears to be in the /app/models/ChannelTest.scala file

  case object Epic extends Channel
  case object EpicAMP extends Channel
  case object EpicAppleNews extends Channel
  case object EpicLiveblog extends Channel
  case object EpicHoldback extends Channel
  case object Banner1 extends Channel
  case object Banner2 extends Channel
  case object Header extends Channel

  For UX, best if we present tests in the same order as the list of channels 
  shown in the hamburger menu and defined in the 
  /public/src/components/drawer.tsx file

  [...]
  <ListItemText primary="Header" />
  <ListItemText primary="Epic" />
  <ListItemText primary="Epic Holdback" />
  <ListItemText primary="Liveblog Epic" />
  <ListItemText primary="Apple News Epic" />
  <ListItemText primary="AMP Epic" />
  <ListItemText primary="Banner 1" />
  <ListItemText primary="Banner 2" />
  [...]
*/ 
const testChannelOrder = ['Header', 'Epic', 'EpicHoldback', 'EpicLiveblog', 'EpicAppleNews', 'EpicAMP', 'Banner1', 'Banner2'];

const testChannelLinks = {
  'Header': '/header-tests', 
  'Epic': '/epic-tests', 
  'EpicHoldback': '/epic-holdback-tests', 
  'EpicLiveblog': '/liveblog-epic-tests', 
  'EpicAppleNews': '/apple-news-epic-tests', 
  'EpicAMP': '/amp-epic-tests', 
  'Banner1': '/banner-tests', 
  'Banner2': '/banner-tests2'
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

      console.log(sortedTests);

      setTestData(sortedTests);
    });
  }, [campaign]);

  const testCard = (test: any) => {

    const getVariantNames = (variants: any) => {
      const vNames = variants.map(v => v.name);
      return vNames.join(', ');
    }

    return (
      <div>
        <ul>
          <li><Link key={`${test.channel}|${test.name}`} to={`${testChannelLinks[test.channel]}/${test.name}`}><b>Test:</b> {test.name}</Link></li>
          <li><b>Channel:</b> {test.channel}</li>
          <li><b>Cohort:</b> {test.userCohort}</li>
          <li><b>Locations:</b> {test.locations.join(', ')}</li>
          <li><b>Variants:</b> {getVariantNames(test.variants)}</li>
          <li><b>Status:</b> {test.status}</li>
        </ul>
      </div>
    )
  }
  return (
    <div className={classes.testEditorContainer}>
      <StickyTopBar name={name} nickname={nickname} />

      <div className={classes.scrollableContainer}>
        <Typography>Name: {name}</Typography>

        {nickname && <Typography>Nickname: {nickname}</Typography>}

        {description && <Typography>Description: {description}</Typography>}

        {testData.map(t => testCard(t))}
      </div>
    </div>
  );
}

export default CampaignsEditor;
