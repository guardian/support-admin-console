import { Checkbox, FormControlLabel } from '@mui/material';
import { styled } from '@mui/material/styles';
import React from 'react';
import { Cta } from '../../channelManagement/helpers/shared';
import VariantCtaFieldsEditor from './variantCtaFieldsEditor';

const Container = styled('div')(({ theme }) => ({
  '& > * + *': {
    marginTop: theme.spacing(1),
  },
}));
const CheckboxContainer = styled('div')({
  height: '50px',
});
const FieldsContainer = styled('div')(({ theme }) => ({
  '& > * + *': {
    marginTop: theme.spacing(3),
  },
}));

interface VariantCtaEditorProps {
  label: string;
  cta?: Cta;
  updateCta: (updatedCta?: Cta) => void;
  onValidationChange: (isValid: boolean) => void;
  defaultCta: Cta;
  isDisabled: boolean;
  copyLength?: number;
  isPrimaryCtaUrlDisabled?: boolean;
}

const VariantCtaEditor: React.FC<VariantCtaEditorProps> = ({
  label,
  cta,
  updateCta,
  onValidationChange,
  defaultCta,
  isDisabled,
  copyLength,
  isPrimaryCtaUrlDisabled,
}: VariantCtaEditorProps) => {
  const isChecked = cta !== undefined;

  const onCheckboxChanged = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const isChecked = event.target.checked;
    updateCta(isChecked ? defaultCta : undefined);
    if (!isChecked) {
      onValidationChange(true);
    }
  };

  return (
    <Container>
      <CheckboxContainer>
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
      </CheckboxContainer>

      {cta && (
        <FieldsContainer>
          <VariantCtaFieldsEditor
            cta={cta}
            updateCta={updateCta}
            onValidationChange={onValidationChange}
            isDisabled={isDisabled}
            copyLength={copyLength}
            isPrimaryCtaUrlDisabled={isPrimaryCtaUrlDisabled}
          />
        </FieldsContainer>
      )}
    </Container>
  );
};

export default VariantCtaEditor;
