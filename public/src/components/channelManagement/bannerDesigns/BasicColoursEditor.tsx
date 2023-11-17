import React from 'react';
import { BasicColours } from '../../../models/bannerDesign';
import { ColourInput } from './ColourInput';
import { makeStyles, Theme } from '@material-ui/core/styles';

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
  basicColours: BasicColours;
  isDisabled: boolean;
  onChange: (colours: BasicColours) => void;
  onValidationChange: (fieldName: string, isValid: boolean) => void;
}

export const BasicColoursEditor: React.FC<Props> = ({
  basicColours,
  isDisabled,
  onValidationChange,
  onChange,
}: Props) => {
  const classes = useStyles();

  return (
    <div className={classes.container}>
      <ColourInput
        colour={basicColours.background}
        name="colours.basic.background"
        label="Background Colour"
        isDisabled={isDisabled}
        onChange={colour => onChange({ ...basicColours, background: colour })}
        onValidationChange={onValidationChange}
      />
      <ColourInput
        colour={basicColours.bodyText}
        name="colours.basic.bodyText"
        label="Body Text Colour"
        isDisabled={isDisabled}
        onChange={colour => onChange({ ...basicColours, bodyText: colour })}
        onValidationChange={onValidationChange}
      />
      <ColourInput
        colour={basicColours.headerText}
        name="colours.basic.headerText"
        label="Header Text Colour"
        isDisabled={isDisabled}
        onChange={colour => onChange({ ...basicColours, headerText: colour })}
        onValidationChange={onValidationChange}
      />
      <ColourInput
        colour={basicColours.articleCountText}
        name="colours.basic.articleCountText"
        label="Article Count Text Colour"
        isDisabled={isDisabled}
        onChange={colour => onChange({ ...basicColours, articleCountText: colour })}
        onValidationChange={onValidationChange}
      />
    </div>
  );
};
