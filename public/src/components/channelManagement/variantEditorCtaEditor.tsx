import React from 'react';
import { Checkbox, FormControlLabel, Theme } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { Cta } from './helpers/shared';
import VariantEditorCtaFieldsEditor from './variantEditorCtaFieldsEditor';

const useStyles = makeStyles(({ spacing }: Theme) => ({
  container: {
    '& > * + *': {
      marginTop: spacing(1),
    },
  },
  checkboxContainer: {
    height: '50px',
  },
  fieldsContainer: {
    '& > * + *': {
      marginTop: spacing(3),
    },
  },
}));

interface VariantEditorCtaEditorProps {
  label: string;
  cta?: Cta;
  updateCta: (updatedCta?: Cta) => void;
  onValidationChange: (isValid: boolean) => void;
  defaultCta: Cta;
  isDisabled: boolean;
}

const VariantEditorCtaEditor: React.FC<VariantEditorCtaEditorProps> = ({
  label,
  cta,
  updateCta,
  onValidationChange,
  defaultCta,
  isDisabled,
}: VariantEditorCtaEditorProps) => {
  const classes = useStyles();
  const isChecked = cta !== undefined;

  const onCheckboxChanged = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const isChecked = event.target.checked;
    updateCta(isChecked ? defaultCta : undefined);
  };

  return (
    <div className={classes.container}>
      <div className={classes.checkboxContainer}>
        <FormControlLabel
          control={
            <Checkbox
              checked={isChecked}
              onChange={onCheckboxChanged}
              color="primary"
              disabled={isDisabled}
            />
          }
          label={label}
        />
      </div>

      {cta && (
        <div className={classes.fieldsContainer}>
          <VariantEditorCtaFieldsEditor
            cta={cta}
            updateCta={updateCta}
            onValidationChange={onValidationChange}
            isDisabled={isDisabled}
          />
        </div>
      )}
    </div>
  );
};

export default VariantEditorCtaEditor;
