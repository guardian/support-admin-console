import React from 'react';
import { ValidatedTestEditorProps } from '../validatedTestEditor';
import {
  SupportLandingPageTest,
  SupportLandingPageVariant,
  Targeting,
} from '../../../models/supportLandingPage';
import { Typography } from '@mui/material';
import VariantsEditor from '../../tests/variants/variantsEditor';
import { useStyles } from '../helpers/testEditorStyles';
import { getDefaultVariant } from './utils/defaults';
import VariantSummary from '../../tests/variants/variantSummary';
import VariantEditor from './variantEditor';
import VariantLandingPagePreview from './variantLandingPagePreview';
import LandingPageTestEditorTargetAudienceSelector from './landingPageTestEditorTargetAudienceSelector';

const SupportLandingPageTestEditor: React.FC<ValidatedTestEditorProps<SupportLandingPageTest>> = ({
  test,
  userHasTestLocked,
  onTestChange,
  setValidationStatusForField,
}: ValidatedTestEditorProps<SupportLandingPageTest>) => {
  const classes = useStyles();

  const updateTest = (updatedTest: SupportLandingPageTest): void => {
    onTestChange({
      ...updatedTest,
    });
  };

  const onVariantsChange = (updatedVariantList: SupportLandingPageVariant[]): void => {
    updateTest({ ...test, variants: updatedVariantList });
  };

  const onVariantChange = (updatedVariant: SupportLandingPageVariant): void => {
    onVariantsChange(
      test.variants.map(variant =>
        variant.name === updatedVariant.name ? updatedVariant : variant,
      ),
    );
  };

  const onVariantDelete = (deletedVariantName: string): void => {
    onVariantsChange(test.variants.filter(variant => variant.name !== deletedVariantName));
  };

  const createVariant = (name: string): void => {
    const newVariant: SupportLandingPageVariant = {
      ...getDefaultVariant(),
      name: name,
    };
    onVariantsChange([...test.variants, newVariant]);
  };

  const onTargetingChange = (updatedTargeting: Targeting): void => {
    updateTest({
      ...test,
      targeting: updatedTargeting,
    });
  };

  const renderVariantEditor = (variant: SupportLandingPageVariant): React.ReactElement => (
    <VariantEditor
      key={`support-landing-page-${test.name}-${variant.name}`}
      variant={variant}
      onVariantChange={onVariantChange}
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
        topButton={<VariantLandingPagePreview variant={variant} />}
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
    onVariantsChange([...test.variants, newVariant]);
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
            Target audience
          </Typography>

          <LandingPageTestEditorTargetAudienceSelector
            targeting={test.targeting}
            onTargetingUpdate={onTargetingChange}
            isDisabled={!userHasTestLocked}
          />
        </div>
      </div>
    );
  }
  return null;
};

export default SupportLandingPageTestEditor;
