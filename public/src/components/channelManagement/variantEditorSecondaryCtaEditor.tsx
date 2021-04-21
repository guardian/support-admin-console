import React from 'react';
import {
  createStyles,
  Theme,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  WithStyles,
  withStyles,
} from '@material-ui/core';
import { Cta, SecondaryCta, SecondaryCtaType } from './helpers/shared';
import VariantEditorCtaFieldsEditor from './variantEditorCtaFieldsEditor';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const styles = ({ spacing }: Theme) =>
  createStyles({
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
  });

interface VariantEditorSecondaryCtaEditorProps extends WithStyles<typeof styles> {
  label: string;
  cta?: SecondaryCta;
  updateCta: (updatedCta?: SecondaryCta) => void;
  onValidationChange: (isValid: boolean) => void;
  isDisabled: boolean;
  defaultCta: Cta;
}

const VariantEditorSecondaryCtaEditor: React.FC<VariantEditorSecondaryCtaEditorProps> = ({
  classes,
  label,
  cta,
  updateCta,
  onValidationChange,
  isDisabled,
  defaultCta,
}: VariantEditorSecondaryCtaEditorProps) => {
  const handleChange = (event: React.ChangeEvent<{ value: unknown }>): void => {
    const value = event.target.value as SecondaryCtaType | 'None';

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
          <InputLabel>{label}</InputLabel>
          <Select value={cta?.type || 'None'} onChange={handleChange} disabled={isDisabled}>
            <MenuItem value={'None'}>None</MenuItem>
            <MenuItem value={SecondaryCtaType.Custom}>Custom</MenuItem>
            <MenuItem value={SecondaryCtaType.ContributionsReminder}>
              Contributions reminder
            </MenuItem>
          </Select>
        </FormControl>
      </div>

      {cta?.type === SecondaryCtaType.Custom && (
        <VariantEditorCtaFieldsEditor
          cta={cta.cta}
          updateCta={updateCustomCta}
          onValidationChange={onValidationChange}
          isDisabled={isDisabled}
        />
      )}
    </div>
  );
};

export default withStyles(styles)(VariantEditorSecondaryCtaEditor);
