import React from 'react';
import {
  Button,
  createStyles,
  withStyles,
  WithStyles,
  Theme,
  Typography,
  ExpansionPanelSummary,
} from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import InsertDriveFileIcon from '@material-ui/icons/InsertDriveFile';
import VisibilityIcon from '@material-ui/icons/Visibility';

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

const BASE_ARTICLE_URL =
  'https://www.theguardian.com/politics/2020/jun/18/dominic-raab-taking-the-knee-feels-like-symbol-of-subjugation?dcr';

const getPreviewUrl = (testName: string, variantName: string): string =>
  `${BASE_ARTICLE_URL}?dcr&force=${testName}:${variantName}`;

interface TestEditorVariantSummaryProps extends WithStyles<typeof styles> {
  name: string;
  testName: string;
  isInEditMode: boolean;
}

const TestEditorVariantSummary: React.FC<TestEditorVariantSummaryProps> = ({
  classes,
  name,
  testName,
  isInEditMode,
}: TestEditorVariantSummaryProps) => {
  return (
    <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
      <div className={classes.container}>
        <div className={classes.nameContainer}>
          <InsertDriveFileIcon className={classes.icon} />

          <Typography variant="h4" className={classes.text}>
            {name}
          </Typography>
        </div>
        <Button
          startIcon={<VisibilityIcon />}
          size="small"
          onClick={(event): void => event.stopPropagation()}
          onFocus={(event): void => event.stopPropagation()}
          href={getPreviewUrl(testName, name)}
          target="_blank"
          rel="noopener noreferrer"
          disabled={isInEditMode}
        >
          Preview
        </Button>
      </div>
    </ExpansionPanelSummary>
  );
};

export default withStyles(styles)(TestEditorVariantSummary);
