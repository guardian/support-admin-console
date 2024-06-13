import React from 'react';
import FormControlLabel from '@mui/material/FormControlLabel';
import {FormControl, Radio, RadioGroup, TextField, Theme} from '@mui/material';
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
    <FormControl>
      <RadioGroup>
        <FormControlLabel
          value="newsletterSignupEnabled"
          key="newsletterSignupEnabled"
          control={<Radio/>}
          label="Enable newsletter sign up"
        />
      </RadioGroup>

      <div>
        <TextField
          name="text"
          label="Button copy"
          margin="normal"
          variant="outlined"
          disabled={isDisabled}
          fullWidth
        />

        <TextField
          name="baseUrl"
          label="Button destination"
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
