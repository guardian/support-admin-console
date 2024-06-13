import React, { useState } from 'react';
import { FormControl, FormControlLabel, Radio, RadioGroup, TextField, Theme } from '@mui/material';
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
  const [isNewsletterSignupEnabled, setIsNewsletterSignupEnabled] = useState<boolean>(false);

  const onRadioChanged = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const isChecked = event.target.value === 'newsletterSignupEnabled';
    setIsNewsletterSignupEnabled(isChecked);
    updateShowNewsletterSignup(isChecked);
  };

  return (
    <FormControl>
      <RadioGroup onChange={onRadioChanged}>
        <FormControlLabel
          value="newsletterSignupEnabled"
          key="newsletterSignupEnabled"
          control={<Radio />}
          label="Enable newsletter sign up"
          disabled={isDisabled}
        />
      </RadioGroup>

      {isNewsletterSignupEnabled && (
        <div className={classes.fieldsContainer}>
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
            label="Newsletter URL"
            margin="normal"
            variant="outlined"
            disabled={isDisabled}
            fullWidth
          />
        </div>
      )}
    </FormControl>
  );
};

export default EpicTestNewsletter;
