import React from 'react';
import { BasicColours } from '../../../models/bannerDesign';
import { ColourInput } from './ColourInput';
import { Theme } from '@mui/material/styles';
import { makeStyles } from '@mui/styles';
import { hexColourToString, stringToHexColour } from '../../../utils/bannerDesigns';
import TypedRadioGroup from '../TypedRadioGroup';

const useStyles = makeStyles(({ spacing, palette }: Theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    '& > * + *': {
      marginTop: spacing(1),
    },
  },
  header: {
    fontSize: 16,
    fontWeight: 500,
    color: palette.grey[700],
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
        onChange={(colour) => onChange({ ...basicColours, background: colour })}
        onValidationChange={onValidationChange}
      />
      <ColourInput
        colour={basicColours.bodyText}
        name="colours.basic.bodyText"
        label="Body Text Colour"
        isDisabled={isDisabled}
        onChange={(colour) => onChange({ ...basicColours, bodyText: colour })}
        onValidationChange={onValidationChange}
      />
      <ColourInput
        colour={basicColours.headerText}
        name="colours.basic.headerText"
        label="Header Text Colour"
        isDisabled={isDisabled}
        onChange={(colour) => onChange({ ...basicColours, headerText: colour })}
        onValidationChange={onValidationChange}
      />
      <ColourInput
        colour={basicColours.articleCountText}
        name="colours.basic.articleCountText"
        label="Article Count Text Colour"
        isDisabled={isDisabled}
        onChange={(colour) => onChange({ ...basicColours, articleCountText: colour })}
        onValidationChange={onValidationChange}
      />
      <div className={classes.header}>Guardian Logo Colour</div>
      <TypedRadioGroup
        selectedValue={hexColourToString(basicColours.logo)}
        onChange={(colour) => onChange({ ...basicColours, logo: stringToHexColour(colour) })}
        isDisabled={isDisabled}
        labels={{ '000000': 'Black', FFFFFF: 'White' }}
      />
    </div>
  );
};
