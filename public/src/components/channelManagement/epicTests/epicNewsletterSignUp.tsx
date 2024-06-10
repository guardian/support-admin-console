import React from 'react';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { Theme } from '@mui/material';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles(({ spacing }: Theme) => ({
  container: {
    '& > * + *': {
      marginTop: spacing(1),
    },
  },
  fieldsContainer: {
    '& > * + *': {
      marginTop: spacing(3),
    },
  },
}));

interface EpicTestNewsletterProps {
  showNewsletterSignup?: boolean;
  updateShowNewsletterSignup: (showNewsletterSignup?: boolean) => void;
  isDisabled: boolean;
}

const EpicTestNewsletter: React.FC<EpicTestNewsletterProps> = ({
                                                                 showNewsletterSignup,
                                                                 updateShowNewsletterSignup,
                                                                               isDisabled,
                                                                             }: EpicTestNewsletterProps) => {
  const classes = useStyles();

  const onToggleShowNewsletterSignup = (): void => {
    updateShowNewsletterSignup(!Boolean(showNewsletterSignup));
  };

  return (
    <div className={classes.container}>
      <FormControlLabel
        control={
          <Checkbox
            checked={Boolean(showNewsletterSignup)}
            onChange={onToggleShowNewsletterSignup}
            color="primary"
            disabled={isDisabled}
          />
        }
        label="Enable newsletter signup"
      />
    </div>
  );
};

export default EpicTestNewsletter;
