import React from 'react';
import { Theme, Accordion, AccordionDetails, AccordionActions } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { Variant } from '../../helpers/shared';
import VariantDeleteButton from './variantDeleteButton';
import VariantCloneButton from './variantCloneButton';

const useStyles = makeStyles(({ spacing, palette }: Theme) => ({
  expansionPanelsContainer: {
    '& > * + *': {
      marginTop: spacing(1),
    },
  },
  expansionPanel: {
    border: `1px solid ${palette.grey[700]}`,
    borderRadius: 4,
    boxShadow: 'none',
  },
}));

interface TestVariantEditorsAccordionProps<V extends Variant> {
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

function EditorsAccordion<V extends Variant>({
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
}: TestVariantEditorsAccordionProps<V>): React.ReactElement<TestVariantEditorsAccordionProps<V>> {
  const classes = useStyles();

  return (
    <div className={classes.expansionPanelsContainer}>
      {variants.map((variant, index) => {
        const variantKey = variantKeys[index];

        return (
          <Accordion
            key={variantKey}
            expanded={variantKey === selectedVariantKey}
            onChange={(): void => onVariantSelected(variantKey)}
            className={classes.expansionPanel}
          >
            {renderVariantSummary(variant)}
            <AccordionDetails>
              {variantKey === selectedVariantKey && renderVariantEditor(variant)}
            </AccordionDetails>
            <AccordionActions>
              <VariantCloneButton
                isDisabled={!editMode}
                existingNames={existingNames}
                cloneVariant={onVariantClone}
                currentVariant={variant}
              />
              <VariantDeleteButton
                isDisabled={!editMode}
                onConfirm={(): void => onVariantDelete(variant.name)}
              />
            </AccordionActions>
          </Accordion>
        );
      })}
    </div>
  );
}

export default EditorsAccordion;
