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
          name={name}
          nickname={nickname}
          existingNames={existingNames}
          existingNicknames={existingNicknames}
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
