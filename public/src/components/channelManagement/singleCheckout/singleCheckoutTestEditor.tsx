import React, { useCallback } from 'react';
import { ValidatedTestEditorProps } from '../validatedTestEditor';
import { SingleCheckoutTest, SingleCheckoutVariant } from '../../../models/singleCheckout';
import { Typography } from '@mui/material';
import VariantsEditor from '../../tests/variants/variantsEditor';
import { useStyles } from '../helpers/testEditorStyles';
import { getDefaultVariant } from './utils/defaults';
import VariantSummary from '../../tests/variants/variantSummary';
import VariantEditor from './variantEditor';
import TestEditorTargetRegionsSelector from '../testEditorTargetRegionsSelector';
import { RegionTargeting } from '../helpers/shared';
import { getStage } from '../../../utils/stage';

const SingleCheckoutTestEditor: React.FC<ValidatedTestEditorProps<SingleCheckoutTest>> = ({
  test,
  userHasTestLocked,
  onTestChange,
  setValidationStatusForField,
}: ValidatedTestEditorProps<SingleCheckoutTest>) => {
  const classes = useStyles();

  const onVariantsChange = (
    update: (current: SingleCheckoutVariant[]) => SingleCheckoutVariant[],
  ): void => {
    onTestChange((current) => {
      const updatedVariantList = update(current.variants);
      return { ...current, variants: updatedVariantList };
    });
  };

  const onVariantChange =
    (variantName: string) =>
    (update: (current: SingleCheckoutVariant) => SingleCheckoutVariant): void => {
      onVariantsChange((current) =>
        current.map((variant) => {
          if (variant.name === variantName) {
            return update(variant);
          }
          return variant;
        }),
      );
    };

  const onVariantDelete = (deletedVariantName: string): void => {
    onVariantsChange((current) => current.filter((variant) => variant.name !== deletedVariantName));
  };

  const createVariant = (name: string): void => {
    const newVariant: SingleCheckoutVariant = {
      ...getDefaultVariant(),
      name: name,
    };
    onVariantsChange((current) => [...current, newVariant]);
  };

  const onTargetingChange = (updatedTargeting: RegionTargeting): void => {
    onTestChange((current) => ({
      ...current,
      regionTargeting: updatedTargeting,
    }));
  };

  const getWebPreviewUrl = (variantName: string): string => {
    const stage = getStage();
    const supportHost = `https://support.${stage !== 'PROD' ? 'code.dev-' : ''}theguardian.com`;
    return `${supportHost}/one-time-checkout?force-single-checkout=${test.name}:${variantName}`;
  };

  const renderVariantEditor = useCallback(
    (variant: SingleCheckoutVariant): React.ReactElement => (
      <VariantEditor
        key={`single-checkout-${test.name}-${variant.name}`}
        variant={variant}
        onVariantChange={onVariantChange(variant.name)}
        onDelete={(): void => onVariantDelete(variant.name)}
        editMode={userHasTestLocked}
        onValidationChange={(isValid: boolean): void =>
          setValidationStatusForField(variant.name, isValid)
        }
      />
    ),
    [test.name, userHasTestLocked, onVariantChange, onVariantDelete, setValidationStatusForField],
  );

  const renderVariantSummary = useCallback(
    (variant: SingleCheckoutVariant): React.ReactElement => (
      <VariantSummary
        name={variant.name}
        testName={test.name}
        testType="SINGLE_CHECKOUT"
        isInEditMode={userHasTestLocked}
        platform="DOTCOM"
        articleType="Standard"
        webPreviewUrl={getWebPreviewUrl(variant.name)}
      />
    ),
    [test.name, userHasTestLocked],
  );

  const onVariantClone = (
    originalVariant: SingleCheckoutVariant,
    clonedVariantName: string,
  ): void => {
    const newVariant: SingleCheckoutVariant = {
      ...originalVariant,
      name: clonedVariantName,
    };
    onVariantsChange((current) => [...current, newVariant]);
  };

  if (!test) {
    return null;
  }

  return (
    <div className={classes.container}>
      <div className={classes.sectionContainer}>
        <Typography variant={'h3'} className={classes.sectionHeader}>
          Variants
        </Typography>
        <div>
          <VariantsEditor
            variants={test.variants}
            createVariant={createVariant}
            testName={test.name}
            editMode={userHasTestLocked}
            renderVariantEditor={renderVariantEditor}
            renderVariantSummary={renderVariantSummary}
            onVariantDelete={onVariantDelete}
            onVariantClone={onVariantClone}
          />
        </div>
      </div>
      <div className={classes.sectionContainer}>
        <Typography variant={'h3'} className={classes.sectionHeader}>
          Target audience
        </Typography>

        <TestEditorTargetRegionsSelector
          regionTargeting={test.regionTargeting}
          onRegionTargetingUpdate={onTargetingChange}
          isDisabled={!userHasTestLocked}
        />
      </div>
    </div>
  );
};

export default SingleCheckoutTestEditor;
