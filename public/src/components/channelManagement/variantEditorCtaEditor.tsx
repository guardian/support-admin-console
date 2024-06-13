import React, { useState } from 'react';
import { FormControl, FormControlLabel, Radio, RadioGroup, Theme } from '@mui/material';
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
  onPrimaryButtonChange: (isSelected: boolean) => void;
}

const VariantEditorCtaEditor: React.FC<VariantEditorCtaEditorProps> = ({
                                                                         cta,
                                                                         updateCta,
                                                                         onValidationChange,
                                                                         defaultCta,
                                                                         isDisabled,
                                                                         onPrimaryButtonChange,
                                                                       }: VariantEditorCtaEditorProps) => {
  const classes = useStyles();
  const [isSelected, setIsSelected] = useState<boolean>(false);

  const onRadioChanged = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const isChecked = event.target.value === 'primaryButton';
    setIsSelected(isChecked);
    onPrimaryButtonChange(isChecked);
    updateCta(isChecked ? defaultCta : undefined);
  };

  return (
    <div className={classes.container}>
      <div className={classes.checkboxContainer}>
        <FormControl>
          <RadioGroup onChange={onRadioChanged}>
            <FormControlLabel
              value="primaryButton"
              key="primaryButton"
              control={<Radio />}
              label="Primary button"
              disabled={isDisabled}
            />
          </RadioGroup>
        </FormControl>
      </div>

      {isSelected && cta && (
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
