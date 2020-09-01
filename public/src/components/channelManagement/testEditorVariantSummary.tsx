import React from 'react';
import {
  createStyles,
  withStyles,
  WithStyles,
  Theme,
  Typography,
  ExpansionPanelSummary,
} from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import InsertDriveFileIcon from '@material-ui/icons/InsertDriveFile';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const styles = ({ spacing, palette }: Theme) =>
  createStyles({
    container: {
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
}

const TestEditorVariantSummary: React.FC<TestEditorVariantSummaryProps> = ({
  classes,
  name,
}: TestEditorVariantSummaryProps) => {
  return (
    <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
      <div className={classes.container}>
        <InsertDriveFileIcon className={classes.icon} />

        <Typography variant="h4" className={classes.text}>
          {name}
        </Typography>
      </div>
    </ExpansionPanelSummary>
  );
};

export default withStyles(styles)(TestEditorVariantSummary);
