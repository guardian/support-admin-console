import React from 'react';
import { Region } from '../../../utils/models';

import { UserCohort } from '../helpers/shared';

import { Typography } from '@material-ui/core';
import HeadTestVariantEditor from './headTestVariantEditor';
import TestVariantsEditor from '../testVariantsEditor';
import TestEditorHeader from '../testEditorHeader';

import TestEditorTargetAudienceSelector from '../testEditorTargetAudienceSelector';

import TestEditorActionButtons from '../testEditorActionButtons';
import LiveSwitch from '../../shared/liveSwitch';
import useValidation from '../hooks/useValidation';
import { HeadTest, HeadVariant } from '../../../models/head';
import { getDefaultVariant } from './utils/defaults';
import TestEditorVariantSummary from '../testEditorVariantSummary';

import { ControlProportionSettings } from '../helpers/controlProportionSettings';
import TestVariantsSplitEditor from '../testVariantsSplitEditor';
import { useStyles } from '../helpers/testEditorStyles';

interface HeadTestEditorProps {
  test: HeadTest;
  hasChanged: boolean;
  onChange: (updatedTest: HeadTest) => void;
  onValidationChange: (isValid: boolean) => void;
  visible: boolean;
  editMode: boolean;
  onDelete: () => void;
  onArchive: () => void;
  onTestSelected: (testName: string) => void;
  testNames: string[];
  testNicknames: string[];
  createTest: (newTest: HeadTest) => void;
}

const HeadTestEditor: React.FC<HeadTestEditorProps> = ({
  test,
  onChange,
  onValidationChange,
  visible,
  editMode,
  onArchive,
  onDelete,
  onTestSelected,
  testNames,
  testNicknames,
  createTest,
}: HeadTestEditorProps) => {
  const classes = useStyles();

  const setValidationStatusForField = useValidation(onValidationChange);

  const updateTest = (updatedTest: HeadTest): void => {
    onChange({ ...updatedTest });
  };

  const onVariantsSplitSettingsValidationChanged = (isValid: boolean): void =>
    setValidationStatusForField('variantsSplitSettings', isValid);

  const onControlProportionSettingsChange = (
    controlProportionSettings?: ControlProportionSettings,
  ): void => updateTest({ ...test, controlProportionSettings });

  const onLiveSwitchChange = (isOn: boolean): void => {
    updateTest({ ...test, isOn });
  };

  const onVariantsChange = (updatedVariantList: HeadVariant[]): void => {
    updateTest({ ...test, variants: updatedVariantList });
  };

  const onVariantChange = (updatedVariant: HeadVariant): void => {
    onVariantsChange(
      test.variants.map(variant =>
        variant.name === updatedVariant.name ? updatedVariant : variant,
      ),
    );
  };

  const onVariantDelete = (deletedVariantName: string): void => {
    onVariantsChange(test.variants.filter(variant => variant.name !== deletedVariantName));
  };

  const onRegionsChange = (updatedRegions: Region[]): void => {
    updateTest({ ...test, locations: updatedRegions });
  };

  const onCohortChange = (updatedCohort: UserCohort): void => {
    updateTest({ ...test, userCohort: updatedCohort });
  };

  const onCopy = (name: string, nickname: string): void => {
    onTestSelected(name);
    createTest({ ...test, name: name, nickname: nickname, isOn: false });
  };

  const renderVariantEditor = (variant: HeadVariant): React.ReactElement => (
    <HeadTestVariantEditor
      key={`head-${test.name}-${variant.name}`}
      variant={variant}
      onVariantChange={onVariantChange}
      onDelete={(): void => onVariantDelete(variant.name)}
      editMode={editMode}
      onValidationChange={(isValid: boolean): void =>
        setValidationStatusForField(variant.name, isValid)
      }
    />
  );

  const renderVariantSummary = (variant: HeadVariant): React.ReactElement => (
    <TestEditorVariantSummary
      name={variant.name}
      testName={test.name}
      testType="BANNER"
      isInEditMode={editMode}
      // hardcoded as heads are currently not supported in AMP or Apple News
      platform="DOTCOM"
    />
  );

  const createVariant = (name: string): void => {
    const newVariant: HeadVariant = {
      ...getDefaultVariant(),
      name: name,
    };
    onVariantsChange([...test.variants, newVariant]);
  };

  if (test && visible) {
    return (
      <div className={classes.container}>
        <div className={classes.headerAndSwitchContainer}>
          <TestEditorHeader name={test.name} nickname={test.nickname} />

          <LiveSwitch
            label="Live on Guardian.com"
            isLive={test.isOn}
            isDisabled={!editMode}
            onChange={onLiveSwitchChange}
          />
        </div>

        <div className={classes.sectionContainer}>
          <Typography variant={'h3'} className={classes.sectionHeader}>
            Variants
          </Typography>
          <div>
            <TestVariantsEditor
              variants={test.variants}
              createVariant={createVariant}
              testName={test.name}
              editMode={editMode}
              renderVariantEditor={renderVariantEditor}
              renderVariantSummary={renderVariantSummary}
              onVariantDelete={onVariantDelete}
            />
          </div>
        </div>

        {test.variants.length > 1 && (
          <div className={classes.sectionContainer}>
            <Typography variant={'h3'} className={classes.sectionHeader}>
              Variants split
            </Typography>
            <div>
              <TestVariantsSplitEditor
                variants={test.variants}
                controlProportionSettings={test.controlProportionSettings}
                onControlProportionSettingsChange={onControlProportionSettingsChange}
                onValidationChange={onVariantsSplitSettingsValidationChanged}
                isDisabled={!editMode}
              />
            </div>
          </div>
        )}

        <div className={classes.sectionContainer}>
          <Typography variant={'h3'} className={classes.sectionHeader}>
            Target audience
          </Typography>

          <TestEditorTargetAudienceSelector
            selectedRegions={test.locations}
            onRegionsUpdate={onRegionsChange}
            selectedCohort={test.userCohort}
            onCohortChange={onCohortChange}
            isDisabled={!editMode}
            showSupporterStatusSelector={true}
          />
        </div>

        <div className={classes.buttonsContainer}>
          <TestEditorActionButtons
            existingNames={testNames}
            existingNicknames={testNicknames}
            isDisabled={!editMode}
            onArchive={onArchive}
            onDelete={onDelete}
            onCopy={onCopy}
          />
        </div>
      </div>
    );
  }
  return null;
};

export default HeadTestEditor;
