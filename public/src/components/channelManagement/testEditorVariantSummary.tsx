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
import TestEditorVariantSummaryPreviewButton from './testEditorVariantSummaryPreviewButton';
import { TestType } from './helpers/shared';

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
  });

interface TestEditorVariantSummaryProps extends WithStyles<typeof styles> {
  name: string;
  testName: string;
  testType: TestType;
  isInEditMode: boolean;
}

const TestEditorVariantSummary: React.FC<TestEditorVariantSummaryProps> = ({
  classes,
  name,
  testName,
  testType,
  isInEditMode,
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
        <TestEditorVariantSummaryPreviewButton
          name={name}
          testName={testName}
          testType={testType}
          isDisabled={isInEditMode}
        />
      </div>
    </AccordionSummary>
  );
};

export default withStyles(styles)(TestEditorVariantSummary);
