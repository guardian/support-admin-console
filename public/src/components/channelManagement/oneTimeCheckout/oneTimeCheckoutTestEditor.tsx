import { Typography } from '@mui/material';
import React, { useEffect, useRef } from 'react';
import { OneTimeCheckoutTest, OneTimeCheckoutVariant } from '../../../models/oneTimeCheckout';
import { getStage } from '../../../utils/stage';
import VariantsEditor from '../../tests/variants/variantsEditor';
import VariantSummary from '../../tests/variants/variantSummary';
import { RegionTargeting } from '../helpers/shared';
import { useStyles } from '../helpers/testEditorStyles';
import { MParticleAudienceEditor } from '../mParticleAudienceEditor';
import ScheduleEditor from '../scheduleEditor';
import TestEditorTargetRegionsSelector from '../testEditorTargetRegionsSelector';
import { ValidatedTestEditorProps } from '../validatedTestEditor';
import { getDefaultVariant } from './utils/defaults';
import VariantEditor from './variantEditor';

const OneTimeCheckoutTestEditor: React.FC<ValidatedTestEditorProps<OneTimeCheckoutTest>> = ({
  test,
  userHasTestLocked,
  onTestChange,
  setValidationStatusForField,
}: ValidatedTestEditorProps<OneTimeCheckoutTest>) => {
  const classes = useStyles();

  const onVariantsChange = (
    update: (current: OneTimeCheckoutVariant[]) => OneTimeCheckoutVariant[],
  ): void => {
    onTestChange((current) => {
      const updatedVariantList = update(current.variants);
      return { ...current, variants: updatedVariantList };
    });
  };

  const onVariantDelete = (deletedVariantName: string): void => {
    onVariantsChange((current) => current.filter((variant) => variant.name !== deletedVariantName));
  };

  const createVariant = (name: string): void => {
    const newVariant: OneTimeCheckoutVariant = {
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
    return `${supportHost}/one-time-checkout?force-one-time-checkout=${test.name}:${variantName}`;
  };

  // Memoize callbacks by variant name to prevent infinite render loops
  // Using refs to store callbacks to avoid dependency issues with useCallback
  const validationCallbacksRef = useRef<Map<string, (isValid: boolean) => void>>(new Map());
  const variantChangeCallbacksRef = useRef<
    Map<string, (update: (current: OneTimeCheckoutVariant) => OneTimeCheckoutVariant) => void>
  >(new Map());
  const setValidationStatusRef = useRef(setValidationStatusForField);
  const onVariantsChangeRef = useRef(onVariantsChange);

  // Keep refs up to date without triggering re-renders
  useEffect(() => {
    setValidationStatusRef.current = setValidationStatusForField;
    onVariantsChangeRef.current = onVariantsChange;
  });

  const getValidationCallback = (variantName: string): ((isValid: boolean) => void) => {
    if (!validationCallbacksRef.current.has(variantName)) {
      validationCallbacksRef.current.set(variantName, (isValid: boolean): void =>
        setValidationStatusRef.current(variantName, isValid),
      );
    }
    return validationCallbacksRef.current.get(variantName)!;
  };

  const getVariantChangeCallback = (
    variantName: string,
  ): ((update: (current: OneTimeCheckoutVariant) => OneTimeCheckoutVariant) => void) => {
    if (!variantChangeCallbacksRef.current.has(variantName)) {
      variantChangeCallbacksRef.current.set(
        variantName,
        (update: (current: OneTimeCheckoutVariant) => OneTimeCheckoutVariant): void => {
          onVariantsChangeRef.current((current) =>
            current.map((variant) => {
              if (variant.name === variantName) {
                return update(variant);
              }
              return variant;
            }),
          );
        },
      );
    }
    return variantChangeCallbacksRef.current.get(variantName)!;
  };

  const renderVariantEditor = (variant: OneTimeCheckoutVariant): React.ReactElement => (
    <VariantEditor
      key={`one-time-checkout-${test.name}-${variant.name}`}
      variant={variant}
      onVariantChange={getVariantChangeCallback(variant.name)}
      onDelete={(): void => onVariantDelete(variant.name)}
      editMode={userHasTestLocked}
      onValidationChange={getValidationCallback(variant.name)}
    />
  );

  const renderVariantSummary = (variant: OneTimeCheckoutVariant): React.ReactElement => (
    <VariantSummary
      name={variant.name}
      testName={test.name}
      testType="ONE_TIME_CHECKOUT"
      isInEditMode={userHasTestLocked}
      platform="DOTCOM"
      articleType="Standard"
      webPreviewUrl={getWebPreviewUrl(variant.name)}
    />
  );

  const onVariantClone = (
    originalVariant: OneTimeCheckoutVariant,
    clonedVariantName: string,
  ): void => {
    const newVariant: OneTimeCheckoutVariant = {
      ...originalVariant,
      name: clonedVariantName,
    };
    onVariantsChange((current) => [...current, newVariant]);
  };

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

        <Typography variant={'h4'} className={classes.sectionHeader} style={{ marginTop: '20px' }}>
          mParticle Audience
        </Typography>

        <MParticleAudienceEditor
          mParticleAudience={test.mParticleAudience}
          disabled={!userHasTestLocked}
          onChange={(mParticleAudience) => {
            onTestChange((current) => ({
              ...current,
              mParticleAudience,
            }));
          }}
        />
      </div>

      <div className={classes.sectionContainer}>
        <Typography variant={'h3'} className={classes.sectionHeader}>
          Schedule
        </Typography>
        <ScheduleEditor
          scheduler={test.scheduler}
          disabled={!userHasTestLocked}
          onChange={(scheduler) => onTestChange((current) => ({ ...current, scheduler }))}
        />
      </div>
    </div>
  );
};

export default OneTimeCheckoutTestEditor;
