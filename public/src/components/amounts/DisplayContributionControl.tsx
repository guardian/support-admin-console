import React from 'react';
import { makeStyles } from '@mui/styles';
import { Checkbox, FormControl, FormControlLabel, FormGroup, FormLabel } from '@mui/material';
import { ContributionType, contributionIds } from '../../utils/models';

const useStyles = makeStyles(() => ({
  contributionControls: {
    display: 'block',
  },
}));

interface DisplayContributionControlProps {
  variantName: string;
  currentContributionDisplay: ContributionType[];
  updateDisplayContribution: (event: React.ChangeEvent<HTMLInputElement>) => void;
  isCountryTest: boolean;
}

export const DisplayContributionControl: React.FC<DisplayContributionControlProps> = ({
  variantName,
  currentContributionDisplay,
  updateDisplayContribution,
  isCountryTest,
}) => {
  const classes = useStyles();

  return (
    <FormControl
      required
      component="fieldset"
      variant="standard"
      className={classes.contributionControls}
    >
      <FormLabel component="legend" id={`${variantName}_display_contribution_selector`}>
        Display contributions type
      </FormLabel>
      <FormGroup row aria-labelledby={`${variantName}_display_contribution_selector`}>
        {contributionIds.map((k) => {
          return (
            <FormControlLabel
              key={`${variantName}_${k}`}
              control={
                <Checkbox
                  checked={currentContributionDisplay.includes(k as ContributionType)}
                  onChange={(e) => updateDisplayContribution(e)}
                  name={k}
                />
              }
              label={k}
              disabled={!isCountryTest}
            />
          );
        })}
      </FormGroup>
    </FormControl>
  );
};
