import React from 'react';
import {
  Theme,
  makeStyles,
  Accordion,
  AccordionDetails,
  AccordionActions,
} from '@material-ui/core';
import { Variant } from './helpers/shared';
import TestEditorVariantSummary from './testEditorVariantSummary';
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
  testName: string;
  editMode: boolean;
  selectedVariantKey: string | null;
  onVariantSelected: (variantKey: string) => void;
  variantEditors: React.ReactElement[];
  onVariantDelete: (variantName: string) => void;
}

function TestVariantEditorsAccordion<V extends Variant>({
  variants,
  variantKeys,
  testName,
  editMode,
  selectedVariantKey,
  onVariantSelected,
  variantEditors,
  onVariantDelete,
}: TestVariantEditorsAccordionProps<V>): React.ReactElement<TestVariantEditorsAccordionProps<V>> {
  const classes = useStyles();

  return (
    <div className={classes.expansionPanelsContainer}>
      {variants.map((variant, index) => {
        const variantKey = variantKeys[index];
        const variantEditor = variantEditors[index];

        return (
          <Accordion
            key={variantKey}
            expanded={variantKey === selectedVariantKey}
            onChange={(): void => onVariantSelected(variantKey)}
            className={classes.expansionPanel}
          >
            <TestEditorVariantSummary
              name={variant.name}
              testName={testName}
              isInEditMode={editMode}
            />
            <AccordionDetails>{variantEditor}</AccordionDetails>
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
