import React from 'react';
import { makeStyles } from '@mui/styles';
import { FormControl, FormControlLabel, FormLabel, Radio, RadioGroup } from '@mui/material';
import { ContributionType, contributionIds } from '../../utils/models';

const useStyles = makeStyles(() => ({
  contributionControls: {
    display: 'block',
  },
}));

interface DefaultContributionControlProps {
  variantName: string;
  currentContributionDefault: ContributionType;
  currentContributionDisplay: ContributionType[];
  updateDefaultContribution: (event: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
}

export const DefaultContributionControl: React.FC<DefaultContributionControlProps> = ({
  variantName,
  currentContributionDefault,
  currentContributionDisplay,
  updateDefaultContribution,
  disabled = false,
}) => {
  const classes = useStyles();

  return (
    <FormControl className={classes.contributionControls}>
      <FormLabel component="legend" id={`${variantName}_default_contribution_selector`}>
        Default contributions type
      </FormLabel>
      <RadioGroup
        aria-labelledby={`${variantName}_default_contribution_selector`}
        name={`${variantName}_default_contribution_selector`}
        value={currentContributionDefault}
        onChange={(e) => updateDefaultContribution(e)}
        row
      >
        {contributionIds.map((k) => {
          return (
            <FormControlLabel
              key={`${variantName}_${k}`}
              value={k}
              control={<Radio />}
              label={k}
              disabled={disabled || !currentContributionDisplay.includes(k as ContributionType)}
            />
          );
        })}
      </RadioGroup>
    </FormControl>
  );
};
