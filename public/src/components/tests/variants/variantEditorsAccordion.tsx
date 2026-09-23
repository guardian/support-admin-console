import { Accordion, AccordionActions, AccordionDetails } from '@mui/material';
import { styled } from '@mui/material/styles';
import React from 'react';
import { Variant } from '../../channelManagement/helpers/shared';
import CloneVariantButton from './cloneVariantButton';
import DeleteVariantButton from './deleteVariantButton';

const ExpansionPanelsContainer = styled('div')(({ theme }) => ({
  '& > * + *': {
    marginTop: theme.spacing(1),
  },
}));
const ExpansionPanel = styled(Accordion)(({ theme }) => ({
  border: `1px solid ${theme.palette.grey[700]}`,
  borderRadius: 4,
  boxShadow: 'none',
}));

interface VariantEditorsAccordionProps<V extends Variant> {
  variants: V[];
  variantKeys: string[];
  existingNames: string[];
  editMode: boolean;
  selectedVariantKey: string | null;
  onVariantSelected: (variantKey: string) => void;
  renderVariantEditor: (variant: V) => React.ReactElement;
  renderVariantSummary: (variant: V) => React.ReactElement;
  onVariantDelete: (variantName: string) => void;
  onVariantClone: (originalVariant: V, variantName: string) => void;
}

function VariantEditorsAccordion<V extends Variant>({
  variants,
  variantKeys,
  existingNames,
  editMode,
  selectedVariantKey,
  onVariantSelected,
  renderVariantEditor,
  renderVariantSummary,
  onVariantDelete,
  onVariantClone,
}: VariantEditorsAccordionProps<V>): React.ReactElement<VariantEditorsAccordionProps<V>> {
  return (
    <ExpansionPanelsContainer>
      {variants.map((variant, index) => {
        const variantKey = variantKeys[index];

        return (
          <ExpansionPanel
            key={variantKey}
            expanded={variantKey === selectedVariantKey}
            onChange={(): void => onVariantSelected(variantKey)}
          >
            {renderVariantSummary(variant)}
            <AccordionDetails>
              {variantKey === selectedVariantKey && renderVariantEditor(variant)}
            </AccordionDetails>
            <AccordionActions>
              <CloneVariantButton
                isDisabled={!editMode}
                existingNames={existingNames}
                cloneVariant={onVariantClone}
                currentVariant={variant}
              />
              <DeleteVariantButton
                isDisabled={!editMode}
                onConfirm={(): void => onVariantDelete(variant.name)}
              />
            </AccordionActions>
          </ExpansionPanel>
        );
      })}
    </ExpansionPanelsContainer>
  );
}

export default VariantEditorsAccordion;
