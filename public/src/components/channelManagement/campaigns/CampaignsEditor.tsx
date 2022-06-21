import React from 'react';
import { makeStyles, Theme, Typography } from '@material-ui/core';
import StickyTopBar from './StickyCampaignBar';
import { Campaign } from './CampaignsForm';

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
  campaign?: Campaign;
  existingNames: string[];
  existingNicknames: string[];
}

function CampaignsEditor({
  campaign,
  existingNames,
  existingNicknames,
}: CampaignsEditorProps): React.ReactElement {
  const classes = useStyles();

  if (campaign) {
    const { name, nickname, description } = campaign;

    return (
      <div className={classes.testEditorContainer}>
        <StickyTopBar
          name={campaign.name}
          nickname={campaign.nickname}
          isNew={false}
          lockStatus={{ locked: false }}
          userHasCampaignLocked={false}
          userHasCampaignListLocked={false}
          existingNames={existingNames}
          existingNicknames={existingNicknames}
          campaignNamePrefix={''}
          onCampaignLock={() => {}}
          onCampaignUnlock={() => {}}
          onCampaignSave={() => {}}
          onCampaignArchive={() => {}}
          onCampaignCopy={() => {}}
          // isNew={!!test.isNew}
          // lockStatus={test.lockStatus || { locked: false }}
          // userHasTestLocked={userHasTestLocked}
          // userHasTestListLocked={userHasTestListLocked}
          // existingNames={existingNames}
          // existingNicknames={existingNicknames}
          // testNamePrefix={testNamePrefix}
          // onTestLock={onTestLock}
          // onTestUnlock={onTestUnlock}
          // onTestSave={onSave}
          // onTestArchive={() => onTestArchive(test.name)}
          // onTestCopy={onTestCopy}
        />

        <div className={classes.scrollableContainer}>
          <Typography>Name: {name}</Typography>

          {nickname && <Typography>Nickname: {nickname}</Typography>}

          {description && <Typography>Description: {description}</Typography>}
        </div>
      </div>
    );
  }
  return <Typography>Select a campaign to view its details.</Typography>;
}

export default CampaignsEditor;
