import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material';
import { styled } from '@mui/material/styles';
import React from 'react';
import { Cta, SecondaryCta, SecondaryCtaType } from '../../channelManagement/helpers/shared';
import VariantCtaFieldsEditor from './variantCtaFieldsEditor';

const Container = styled('div')(({ theme }) => ({
  '& > * + *': {
    marginTop: theme.spacing(1),
  },
}));
const SelectContainer = styled('div')({
  height: '50px',
});
const FormControlStyled = styled(FormControl)({
  minWidth: 240,
});

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
  const handleChange = (event: SelectChangeEvent<SecondaryCtaType | 'None'>): void => {
    const value = event.target.value;

    if (value === SecondaryCtaType.Custom.valueOf()) {
      updateCta({ type: SecondaryCtaType.Custom, cta: defaultCta });
    } else if (value === SecondaryCtaType.ContributionsReminder.valueOf()) {
      updateCta({ type: SecondaryCtaType.ContributionsReminder });
      onValidationChange(true);
    } else {
      updateCta(undefined);
      onValidationChange(true);
    }
  };

  const updateCustomCta = (cta: Cta): void => {
    updateCta({ type: SecondaryCtaType.Custom, cta });
  };

  return (
    <Container>
      <SelectContainer>
        <FormControlStyled>
          <InputLabel id="secondaryCtaTypeLabel" htmlFor="secondary-cta-type">
            {label}
          </InputLabel>
          <Select
            id={'secondaryCtaType'}
            name="secondary-cta-type"
            labelId={'secondaryCtaTypeLabel'}
            label={label}
            value={cta?.type ?? 'None'}
            onChange={handleChange}
            disabled={isDisabled}
            inputProps={{ id: 'secondary-cta-type' }}
          >
            <MenuItem value={'None'}>None</MenuItem>
            {allowVariantCustomSecondaryCta && (
              <MenuItem value={SecondaryCtaType.Custom}>Custom</MenuItem>
            )}
            <MenuItem value={SecondaryCtaType.ContributionsReminder}>
              Contributions reminder
            </MenuItem>
          </Select>
        </FormControlStyled>
      </SelectContainer>

      {cta?.type === SecondaryCtaType.Custom && (
        <VariantCtaFieldsEditor
          cta={cta.cta}
          updateCta={updateCustomCta}
          onValidationChange={onValidationChange}
          isDisabled={isDisabled}
        />
      )}
    </Container>
  );
};

export default VariantEditorSecondaryCtaEditor;
