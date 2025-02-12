import React from 'react';
import { Theme, Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';
import LandingPageTestEditorTargetRegionsSelector from './landingPageTestEditorTargetRegionsSelector';
import { Targeting } from '../../../models/supportLandingPage';

const useStyles = makeStyles(({ spacing, palette }: Theme) => ({
  container: {
    display: 'flex',
    gap: spacing(12),
    flexWrap: 'wrap',
  },
  heading: {
    fontSize: 16,
    color: palette.grey[900],
    fontWeight: 500,
  },
  containerSection: {
    display: 'inline',
    gap: spacing(12),
    flexWrap: 'wrap',
  },
}));

interface LandingPageTestEditorTargetAudienceSelectorProps {
  targeting: Targeting;
  onTargetingUpdate: (targeting: Targeting) => void;
  isDisabled: boolean;
}

const LandingPageTestEditorTargetAudienceSelector: React.FC<LandingPageTestEditorTargetAudienceSelectorProps> = ({
  targeting,
  onTargetingUpdate,
  isDisabled,
}: LandingPageTestEditorTargetAudienceSelectorProps) => {
  const classes = useStyles();

  return (
    <div className={classes.container}>
      <div className={classes.containerSection}>
        <Typography className={classes.heading}>Region</Typography>
        <LandingPageTestEditorTargetRegionsSelector
          targeting={targeting}
          onTargetingUpdate={onTargetingUpdate}
          isDisabled={isDisabled}
        />
      </div>
    </div>
  );
};

export default LandingPageTestEditorTargetAudienceSelector;
