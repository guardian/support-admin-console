import React from "react";
import {ValidatedTestEditorProps} from "../channelManagement/validatedTestEditor";
import {ThreeTierChoiceCards, ThreeTierChoiceCardVariant} from "../../models/threeTierChoiceCards";
import {useStyles} from "../channelManagement/helpers/testEditorStyles";
import {RegionTargeting} from "../channelManagement/helpers/shared";
import VariantSummary from "../tests/variants/variantSummary";
import {Typography} from "@mui/material";
import VariantsEditor from "../tests/variants/variantsEditor";
import TestEditorTargetRegionsSelector from "../channelManagement/testEditorTargetRegionsSelector";
import {getDefaultVariant} from "./choiceCardDefaults";

const ThreeTierChoiceCardsEditor: React.FC<ValidatedTestEditorProps<ThreeTierChoiceCards>> = ({
  test,
  userHasTestLocked,
  onTestChange,
  setValidationStatusForField,
}: ValidatedTestEditorProps<ThreeTierChoiceCards>) => {
  const classes = useStyles()

  const updateTest = (updatedTest: ThreeTierChoiceCards): void => {
    onTestChange({
      ...updatedTest,
    });
  };

  const onVariantsChange = (updatedVariantList: ThreeTierChoiceCardVariant[]): void => {
    updateTest({ ...test, variants: updatedVariantList });
  };

  const onVariantChange = (updatedVariant: ThreeTierChoiceCardVariant): void => {
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
    const newVariant: ThreeTierChoiceCardVariant = {
      ...getDefaultVariant(),
      name: name,
    };
    onVariantsChange([...test.variants, newVariant]);
  };

  const onTargetingChange = (updatedTargeting: RegionTargeting): void => {
    updateTest({
      ...test,
      regionTargeting: updatedTargeting,
    });
  };

  const renderVariantEditor = (variant: ThreeTierChoiceCardVariant): React.ReactElement => (
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

  const renderVariantSummary = (variant: ThreeTierChoiceCardVariant): React.ReactElement => {
    return (
      <VariantSummary
        name={variant.name}
        testName={test.name}
        testType="THREE_TIER_CHOICE_CARDS"
        isInEditMode={userHasTestLocked}
        platform="DOTCOM"
        articleType="Standard"
      />
    );
  };

  const onVariantClone = (
    originalVariant: ThreeTierChoiceCardVariant,
    clonedVariantName: string,
  ): void => {
    const newVariant: ThreeTierChoiceCardVariant = {
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

          <TestEditorTargetRegionsSelector
            regionTargeting={test.regionTargeting}
            onRegionTargetingUpdate={onTargetingChange}
            isDisabled={!userHasTestLocked}
          />
        </div>
      </div>
    );
  }
  return null;
};

export default ThreeTierChoiceCardsEditor;
