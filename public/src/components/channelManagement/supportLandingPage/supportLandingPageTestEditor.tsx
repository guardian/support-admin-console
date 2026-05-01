import { Typography } from '@mui/material';
import React from 'react';
import {
  SupportLandingPageTest,
  SupportLandingPageVariant,
} from '../../../models/supportLandingPage';
import VariantsEditor from '../../tests/variants/variantsEditor';
import VariantSummary from '../../tests/variants/variantSummary';
import { Methodology, RegionTargeting } from '../helpers/shared';
import { useStyles } from '../helpers/testEditorStyles';
import { MParticleAudienceEditor } from '../mParticleAudienceEditor';
import TestEditorTargetRegionsSelector from '../testEditorTargetRegionsSelector';
import { TestMethodologyEditor } from '../TestMethodologyEditor';
import { ValidatedTestEditorProps } from '../validatedTestEditor';
import { getDefaultVariant } from './utils/defaults';
import VariantEditor from './variantEditor';

const SupportLandingPageTestEditor: React.FC<ValidatedTestEditorProps<SupportLandingPageTest>> = ({
  test,
  userHasTestLocked,
  onTestChange,
  setValidationStatusForField,
}: ValidatedTestEditorProps<SupportLandingPageTest>) => {
  const classes = useStyles();

  const onVariantsChange = (
    update: (current: SupportLandingPageVariant[]) => SupportLandingPageVariant[],
  ): void => {
    onTestChange((current) => {
      const updatedVariantList = update(current.variants);
      return { ...current, variants: updatedVariantList };
    });
  };

  const onVariantChange =
    (variantName: string) =>
    (update: (current: SupportLandingPageVariant) => SupportLandingPageVariant): void => {
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
    const newVariant: SupportLandingPageVariant = {
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

  const onMethodologyChange = (methodologies: Methodology[]): void => {
    setValidationStatusForField('methodologies', methodologies.length > 0);
    onTestChange((current) => ({ ...current, methodologies }));
  };

  const renderVariantEditor = (variant: SupportLandingPageVariant): React.ReactElement => (
    <VariantEditor
      key={`support-landing-page-${test.name}-${variant.name}`}
      variant={variant}
      testName={test.name}
      onVariantChange={onVariantChange(variant.name)}
      onDelete={(): void => onVariantDelete(variant.name)}
      editMode={userHasTestLocked}
      onValidationChange={(isValid: boolean): void =>
        setValidationStatusForField(variant.name, isValid)
      }
    />
  );

  const renderVariantSummary = (variant: SupportLandingPageVariant): React.ReactElement => {
    return (
      <VariantSummary
        name={variant.name}
        testName={test.name}
        testType="LANDING_PAGE"
        isInEditMode={userHasTestLocked}
        platform="DOTCOM"
        articleType="Standard"
      />
    );
  };

  const onVariantClone = (
    originalVariant: SupportLandingPageVariant,
    clonedVariantName: string,
  ): void => {
    const newVariant: SupportLandingPageVariant = {
      ...originalVariant,
      name: clonedVariantName,
    };
    onVariantsChange((current) => [...current, newVariant]);
  };

  if (test) {
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
            Experiment Methodology
          </Typography>
          <TestMethodologyEditor
            methodologies={test.methodologies}
            testName={test.name}
            channel={test.channel ?? ''}
            isDisabled={!userHasTestLocked || test.status === 'Live'}
            onChange={onMethodologyChange}
          />
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

          <Typography
            variant={'h4'}
            className={classes.sectionHeader}
            style={{ marginTop: '20px' }}
          >
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
      </div>
    );
  }
  return null;
};

export default SupportLandingPageTestEditor;
