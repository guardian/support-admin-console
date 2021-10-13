import React from 'react';
import {
  createStyles,
  withStyles,
  WithStyles,
  Theme,
  Typography,
  AccordionSummary,
} from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import InsertDriveFileIcon from '@material-ui/icons/InsertDriveFile';
import TestEditorVariantSummaryWebPreviewButton from './testEditorVariantSummaryWebPreviewButton';
import { TestPlatform, TestType } from './helpers/shared';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const styles = ({ spacing, palette }: Theme) =>
  createStyles({
    container: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      width: '100%',
    },
    nameContainer: {
      display: 'flex',
      alignItems: 'center',

      '& > * + *': {
        marginLeft: spacing(1),
      },
    },
    icon: {
      display: 'inline-block',
      fill: palette.grey[700],
    },
    text: {
      fontSize: 14,
      fontWeight: 500,
      letterSpacing: 1,
      textTransform: 'uppercase',
    },
    buttonsContainer: {
      display: 'flex',
      flexDirection: 'row',
      '& > *': {
        marginLeft: '20px',
      },
    },
  });

interface TestEditorVariantSummaryProps extends WithStyles<typeof styles> {
  name: string;
  testName: string;
  testType: TestType;
  isInEditMode: boolean;
  topButton?: React.ReactElement;
  platform: TestPlatform;
}

const TestEditorVariantSummary: React.FC<TestEditorVariantSummaryProps> = ({
  classes,
  name,
  testName,
  testType,
  isInEditMode,
  topButton,
  platform,
}: TestEditorVariantSummaryProps) => {
  return (
    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
      <div className={classes.container}>
        <div className={classes.nameContainer}>
          <InsertDriveFileIcon className={classes.icon} />

          <Typography variant="h4" className={classes.text}>
            {name}
          </Typography>
        </div>
        <div className={classes.buttonsContainer}>
          {topButton}
          <TestEditorVariantSummaryWebPreviewButton
            name={name}
            testName={testName}
            testType={testType}
            platform={platform}
            isDisabled={isInEditMode}
          />
        </div>
      </div>
    </AccordionSummary>
  );
};

export default withStyles(styles)(TestEditorVariantSummary);
