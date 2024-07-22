import React from 'react';
import { Theme, Typography, AccordionSummary } from '@mui/material';
import { makeStyles } from '@mui/styles';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import VariantSummaryWebPreviewButton, { ArticleType } from './variantSummaryWebPreviewButton';
import { TestPlatform, TestType } from '../../channelManagement/helpers/shared';

const useStyles = makeStyles(({ spacing, palette }: Theme) => ({
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
}));

interface VariantSummaryProps {
  name: string;
  testName: string;
  testType: TestType;
  isInEditMode: boolean;
  topButton?: React.ReactElement;
  platform: TestPlatform;
  articleType: ArticleType;
}

const VariantSummary: React.FC<VariantSummaryProps> = ({
  name,
  testName,
  testType,
  isInEditMode,
  topButton,
  platform,
  articleType,
}: VariantSummaryProps) => {
  const classes = useStyles();

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
          <VariantSummaryWebPreviewButton
            name={name}
            testName={testName}
            testType={testType}
            platform={platform}
            isDisabled={isInEditMode}
            articleType={articleType}
          />
        </div>
      </div>
    </AccordionSummary>
  );
};

export default VariantSummary;
