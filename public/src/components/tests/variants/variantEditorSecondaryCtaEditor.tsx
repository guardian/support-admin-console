import React from 'react';
import { Theme, FormControl, InputLabel, Select, MenuItem, SelectChangeEvent } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { Cta, SecondaryCta, SecondaryCtaType } from '../../channelManagement/helpers/shared';
import VariantCtaFieldsEditor from './variantCtaFieldsEditor';

const useStyles = makeStyles(({ spacing }: Theme) => ({
  container: {
    '& > * + *': {
      marginTop: spacing(1),
    },
  },
  selectContainer: {
    height: '50px',
  },
  formControl: {
    minWidth: 240,
  },
}));

interface VariantEditorSecondaryCtaEditorProps {
  label: string;
  cta?: SecondaryCta;
  updateCta: (updatedCta?: SecondaryCta) => void;
  allowVariantCustomSecondaryCta: boolean;
  onValidationChange: (isValid: boolean) => void;
  isDisabled: boolean;
  defaultCta: Cta;
}

const VariantEditorSecondaryCtaEditor: React.FC<VariantEditorSecondaryCtaEditorProps> = ({
  label,
  cta,
  updateCta,
  allowVariantCustomSecondaryCta,
  onValidationChange,
  isDisabled,
  defaultCta,
}: VariantEditorSecondaryCtaEditorProps) => {
  const classes = useStyles();

  const handleChange = (event: SelectChangeEvent<SecondaryCtaType | 'None'>): void => {
    const value = event.target.value;

    if (value === SecondaryCtaType.Custom) {
      updateCta({ type: SecondaryCtaType.Custom, cta: defaultCta });
    } else if (value === SecondaryCtaType.ContributionsReminder) {
      updateCta({ type: SecondaryCtaType.ContributionsReminder });
    } else {
      updateCta(undefined);
    }
  };

  const updateCustomCta = (cta: Cta): void => {
    updateCta({ type: SecondaryCtaType.Custom, cta });
  };

  return (
    <div className={classes.container}>
      <div className={classes.selectContainer}>
        <FormControl className={classes.formControl}>
          <InputLabel id="secondaryCtaTypeLabel">{label}</InputLabel>
          <Select
            id={'secondaryCtaType'}
            labelId={'secondaryCtaTypeLabel'}
            label={label}
            value={cta?.type || 'None'}
            onChange={handleChange}
            disabled={isDisabled}
          >
            <MenuItem value={'None'}>None</MenuItem>
            {allowVariantCustomSecondaryCta && (
              <MenuItem value={SecondaryCtaType.Custom}>Custom</MenuItem>
            )}
            <MenuItem value={SecondaryCtaType.ContributionsReminder}>
              Contributions reminder
            </MenuItem>
          </Select>
        </FormControl>
      </div>

      {cta?.type === SecondaryCtaType.Custom && (
        <VariantCtaFieldsEditor
          cta={cta.cta}
          updateCta={updateCustomCta}
          onValidationChange={onValidationChange}
          isDisabled={isDisabled}
        />
      )}
    </div>
  );
};

export default VariantEditorSecondaryCtaEditor;
