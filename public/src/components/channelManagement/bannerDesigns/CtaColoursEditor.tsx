import React from 'react';
import { CtaDesign } from '../../../models/bannerDesign';
import { Theme } from '@mui/material/styles';
import { makeStyles } from '@mui/styles';
import { ColourInput, OptionalColourInput } from './ColourInput';

const useLocalStyles = makeStyles(({ palette }: Theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'row',
    marginTop: '16px',
  },
  stateContainer: {
    display: 'flex',
    flexDirection: 'column',
    marginRight: '16px',
  },
  stateLabel: {
    fontSize: 16,
    fontWeight: 500,
  },
  header: {
    fontSize: 16,
    fontWeight: 500,
    color: palette.grey[700],
  },
}));

interface Props {
  cta: CtaDesign;
  isDisabled: boolean;
  onChange: (cta: CtaDesign) => void;
  onValidationChange: (fieldName: string, isValid: boolean) => void;
  name: string;
  label: string;
}

export const CtaColoursEditor: React.FC<Props> = ({
  cta,
  isDisabled,
  onValidationChange,
  onChange,
  name,
  label,
}: Props) => {
  const classes = useLocalStyles();

  return (
    <div>
      <div className={classes.header}>{label}</div>
      <div className={classes.container}>
        <div className={classes.stateContainer}>
          <div className={classes.stateLabel}>Default</div>

          <ColourInput
            colour={cta.default.text}
            name={`${name}.text`}
            label="Text Colour"
            isDisabled={isDisabled}
            onChange={colour => onChange({ ...cta, default: { ...cta.default, text: colour } })}
            onValidationChange={onValidationChange}
          />
          <ColourInput
            colour={cta.default.background}
            name={`${name}.background`}
            label="Background Colour"
            isDisabled={isDisabled}
            onChange={colour =>
              onChange({ ...cta, default: { ...cta.default, background: colour } })
            }
            onValidationChange={onValidationChange}
          />
          <OptionalColourInput
            colour={cta.default.border}
            name={`${name}.border`}
            label="Border Colour"
            isDisabled={isDisabled}
            onChange={colour => onChange({ ...cta, default: { ...cta.default, border: colour } })}
            onValidationChange={onValidationChange}
          />
        </div>

        <div className={classes.stateContainer}>
          <div className={classes.stateLabel}>Hover</div>

          <ColourInput
            colour={cta.hover.text}
            name={`${name}.text`}
            label="Text Colour"
            isDisabled={isDisabled}
            onChange={colour => onChange({ ...cta, hover: { ...cta.hover, text: colour } })}
            onValidationChange={onValidationChange}
          />
          <ColourInput
            colour={cta.hover.background}
            name={`${name}.background`}
            label="Background Colour"
            isDisabled={isDisabled}
            onChange={colour => onChange({ ...cta, hover: { ...cta.hover, background: colour } })}
            onValidationChange={onValidationChange}
          />
          <OptionalColourInput
            colour={cta.hover.border}
            name={`${name}.border`}
            label="Border Colour"
            isDisabled={isDisabled}
            onChange={colour => onChange({ ...cta, hover: { ...cta.hover, border: colour } })}
            onValidationChange={onValidationChange}
          />
        </div>
      </div>
    </div>
  );
};
