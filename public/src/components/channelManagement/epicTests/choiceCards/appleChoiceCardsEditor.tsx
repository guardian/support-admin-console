import React from 'react';
import { EpicVariant } from '../../../../models/epic';
import { Cta } from '../../helpers/shared';
import { FormControl, FormControlLabel, Radio, RadioGroup } from '@mui/material';
import VariantEditorCtaFieldsEditor from '../../variantEditorCtaFieldsEditor';
import { DEFAULT_PRIMARY_CTA } from '../utils/defaults';

interface AppleNewsChoiceCardsProps {
  variant: EpicVariant;
  editMode: boolean;
  updateShowChoiceCards: (updatedshowChoiceCards?: boolean) => void;
  updatePrimaryCta: (updatedCta?: Cta) => void;
  onValidationChange: (isValid: boolean) => void;
}

export const AppleNewsChoiceCards: React.FC<AppleNewsChoiceCardsProps> = ({
  variant,
  updateShowChoiceCards,
  editMode,
  updatePrimaryCta,
  onValidationChange,
}: AppleNewsChoiceCardsProps) => {
  const onRadioGroupChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    if (event.target.value === 'choiceCardsEnabled') {
      updateShowChoiceCards(true);
    } else {
      updateShowChoiceCards(false);
    }
  };

  const primaryCtaEnabled = !variant.showChoiceCards;

  return (
    <FormControl>
      <RadioGroup
        value={variant.showChoiceCards ? 'choiceCardsEnabled' : 'choiceCardsDisabled'}
        onChange={onRadioGroupChange}
      >
        <FormControlLabel
          value="choiceCardsEnabled"
          key="choiceCardsEnabled"
          control={<Radio />}
          label="Enable choice cards"
          disabled={!editMode}
        />
        <FormControlLabel
          value="choiceCardsDisabled"
          key="choiceCardsDisabled"
          control={<Radio />}
          label="Enable primary button"
          disabled={!editMode}
        />
      </RadioGroup>
      {primaryCtaEnabled && (
        <VariantEditorCtaFieldsEditor
          cta={variant.cta ?? DEFAULT_PRIMARY_CTA}
          updateCta={updatePrimaryCta}
          onValidationChange={onValidationChange}
          isDisabled={!editMode}
        />
      )}
    </FormControl>
  );
};
