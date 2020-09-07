import React from 'react';
import {
  Theme,
  createStyles,
  WithStyles,
  withStyles,
  ExpansionPanel,
  ExpansionPanelDetails,
  ExpansionPanelActions,
} from '@material-ui/core';
import { BannerVariant } from './bannerTestsForm';
import BannerTestVariantEditor from './bannerTestVariantEditor';
import TestEditorVariantSummary from '../testEditorVariantSummary';
import VariantDeleteButton from '../variantDeleteButton';
import useValidation from '../hooks/useValidation';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const styles = ({ spacing, palette }: Theme) =>
  createStyles({
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
  });

interface BannerTestVariantEditorsAccordionProps extends WithStyles<typeof styles> {
  variants: BannerVariant[];
  variantKeys: string[];
  onVariantsListChange: (variantList: BannerVariant[]) => void;
  editMode: boolean;
  onValidationChange: (isValid: boolean) => void;
  selectedVariantKey: string | null;
  onVariantSelected: (variantKey: string) => void;
}

const BannerTestVariantEditorsAccordion: React.FC<BannerTestVariantEditorsAccordionProps> = ({
  classes,
  variants,
  variantKeys,
  onVariantsListChange,
  editMode,
  onValidationChange,
  selectedVariantKey,
  onVariantSelected,
}: BannerTestVariantEditorsAccordionProps) => {
  const setValidationStatusForField = useValidation(onValidationChange);

  const onVariantChange = (updatedVariant: BannerVariant): void => {
    const updatedVariantList: BannerVariant[] = variants.map(variant =>
      variant.name === updatedVariant.name ? updatedVariant : variant,
    );
    onVariantsListChange(updatedVariantList);
  };

  const onVariantDelete = (variantName: string): void => {
    const updatedVariantList = variants.filter(variant => variant.name !== variantName);
    onVariantsListChange(updatedVariantList);
  };

  return (
    <div className={classes.expansionPanelsContainer}>
      {variants.map((variant, index) => {
        const variantKey = variantKeys[index];
        return (
          <ExpansionPanel
            key={variant.name}
            expanded={variantKey === selectedVariantKey}
            onChange={(): void => onVariantSelected(variantKey)}
            className={classes.expansionPanel}
          >
            <TestEditorVariantSummary
              name={variant.name}
              testName={testName}
              isInEditMode={editMode}
            />
            <ExpansionPanelDetails>
              <BannerTestVariantEditor
                variant={variant}
                onVariantChange={onVariantChange}
                editMode={editMode}
                onDelete={(): void => {
                  onVariantDelete(variant.name);
                  setValidationStatusForField(variant.name, true);
                }}
                onValidationChange={(isValid: boolean): void =>
                  setValidationStatusForField(variant.name, isValid)
                }
              />
            </ExpansionPanelDetails>
            <ExpansionPanelActions>
              <VariantDeleteButton
                isDisabled={!editMode}
                onConfirm={(): void => onVariantDelete(variant.name)}
              />
            </ExpansionPanelActions>
          </ExpansionPanel>
        );
      })}
    </div>
  );
};

export default withStyles(styles)(BannerTestVariantEditorsAccordion);
