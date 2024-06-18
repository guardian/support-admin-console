import React from 'react';
import { FormControl, TextField, Theme } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { NewsletterSignup } from '../helpers/shared';

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
  updateShowNewsletterSignup: (showNewsletterSignup?: NewsletterSignup) => void;
  newsletterSignup?: NewsletterSignup;
  isDisabled: boolean;
}

const EpicTestNewsletter: React.FC<EpicTestNewsletterProps> = ({
  isDisabled,
}: EpicTestNewsletterProps) => {
  const classes = useStyles();

  return (
    <FormControl>
      <div className={classes.fieldsContainer}>
        <TextField
          name="baseUrl"
          label="Newsletter URL"
          margin="normal"
          variant="outlined"
          disabled={isDisabled}
          fullWidth
        />
      </div>
    </FormControl>
  );
};

export default EpicTestNewsletter;
