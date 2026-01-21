import { TickerDesign } from '../../../models/bannerDesign';
import React from 'react';
import { ColourInput } from './ColourInput';
import { Theme } from '@mui/material/styles';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles(({ spacing }: Theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    '& > * + *': {
      marginTop: spacing(1),
    },
  },
}));

interface Props {
  ticker: TickerDesign;
  isDisabled: boolean;
  onChange: (ticker: TickerDesign) => void;
  onValidationChange: (fieldName: string, isValid: boolean) => void;
}

export const TickerDesignEditor: React.FC<Props> = ({
  ticker,
  isDisabled,
  onValidationChange,
  onChange,
}: Props) => {
  const classes = useStyles();

  return (
    <div className={classes.container}>
      <ColourInput
        colour={ticker.filledProgress}
        name="ticker.filledProgress"
        label="Filled Progress Colour"
        isDisabled={isDisabled}
        onChange={(colour) => onChange({ ...ticker, filledProgress: colour })}
        onValidationChange={onValidationChange}
      />
      <ColourInput
        colour={ticker.progressBarBackground}
        name="ticker.progressBarBackground"
        label="Progress Bar Background Colour"
        isDisabled={isDisabled}
        onChange={(colour) => onChange({ ...ticker, progressBarBackground: colour })}
        onValidationChange={onValidationChange}
      />
      <ColourInput
        colour={ticker.headlineColour}
        name="ticker.headlineColour"
        label="Headline Colour"
        isDisabled={isDisabled}
        onChange={(colour) => onChange({ ...ticker, headlineColour: colour })}
        onValidationChange={onValidationChange}
      />
      <ColourInput
        colour={ticker.totalColour}
        name="ticker.totalColour"
        label="Total Colour"
        isDisabled={isDisabled}
        onChange={(colour) => onChange({ ...ticker, totalColour: colour })}
        onValidationChange={onValidationChange}
      />
      <ColourInput
        colour={ticker.goalColour}
        name="ticker.goalColour"
        label="Goal Colour"
        isDisabled={isDisabled}
        onChange={(colour) => onChange({ ...ticker, goalColour: colour })}
        onValidationChange={onValidationChange}
      />
    </div>
  );
};
