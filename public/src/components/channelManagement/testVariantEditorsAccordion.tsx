import React from 'react';
import {
  Theme,
  makeStyles,
  Accordion,
  AccordionDetails,
  AccordionActions,
} from '@material-ui/core';
import { Variant } from './helpers/shared';
import VariantDeleteButton from './variantDeleteButton';

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
  editMode: boolean;
  selectedVariantKey: string | null;
  onVariantSelected: (variantKey: string) => void;
  renderVariantEditor: (variant: V) => React.ReactElement;
  renderVariantSummary: (variant: V) => React.ReactElement;
  onVariantDelete: (variantName: string) => void;
}

function TestVariantEditorsAccordion<V extends Variant>({
  variants,
  variantKeys,
  editMode,
  selectedVariantKey,
  onVariantSelected,
  renderVariantEditor,
  renderVariantSummary,
  onVariantDelete,
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
            <AccordionDetails>{renderVariantEditor(variant)}</AccordionDetails>
            <AccordionActions>
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

export default TestVariantEditorsAccordion;
