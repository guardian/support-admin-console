import React from 'react';
import { Region } from '../../../utils/models';
import { EpicDesignTest, MaxEpicViews } from './epicTestsForm';
import { UserCohort, EpicEditorConfig } from '../helpers/shared';
import { makeStyles, FormControlLabel, Switch, Theme, Typography } from '@material-ui/core';
import TestEditorHeader from '../testEditorHeader';
import TestEditorTargetAudienceSelector from '../testEditorTargetAudienceSelector';
import TestEditorActionButtons from '../testEditorActionButtons';
import EpicTestTargetContentEditor from './epicTestTargetContentEditor';
import EpicTestMaxViewsEditor from './epicTestMaxViewsEditor';
import useValidation from '../hooks/useValidation';
import LiveSwitch from '../../shared/liveSwitch';

const useStyles = makeStyles(({ spacing, palette }: Theme) => ({
  container: {
    width: '100%',
    height: 'max-content',
    background: '#FFFFFF',
    paddingTop: spacing(6),
    paddingRight: spacing(12),
    paddingLeft: spacing(3),
  },
  headerAndSwitchContainer: {
    paddingBottom: spacing(3),
    borderBottom: `1px solid ${palette.grey[500]}`,

    '& > * + *': {
      marginTop: spacing(2),
    },
  },
  sectionContainer: {
    paddingTop: spacing(1),
    paddingBottom: spacing(6),
    borderBottom: `1px solid ${palette.grey[500]}`,

    '& > * + *': {
      marginTop: spacing(4),
    },
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: 500,
    color: palette.grey[700],
  },
  buttonsContainer: {
    paddingTop: spacing(4),
    paddingBottom: spacing(12),
  },
}));

interface EpicDesignTestEditorProps {
  test: EpicDesignTest;
  hasChanged: boolean;
  epicEditorConfig: EpicEditorConfig;
  onChange: (updatedTest: EpicDesignTest) => void;
  onValidationChange: (isValid: boolean) => void;
  visible: boolean;
  editMode: boolean;
  onDelete: () => void;
  onArchive: () => void;
  testNames: string[];
  testNicknames: string[];
  testNamePrefix?: string;
}

const EpicDesignTestEditor: React.FC<EpicDesignTestEditorProps> = ({
  test,
  epicEditorConfig,
  onChange,
  editMode,
  onDelete,
  onArchive,
  testNames,
  testNicknames,
  testNamePrefix,
  onValidationChange,
}: EpicDesignTestEditorProps) => {
  const classes = useStyles();

  const setValidationStatusForField = useValidation(onValidationChange);

  const onMaxViewsValidationChange = (isValid: boolean): void =>
    setValidationStatusForField('maxViews', isValid);

  const updateTest = (update: (test: EpicDesignTest) => EpicDesignTest): void => {
    if (test) {
      const updatedTest = update(test);

      onChange({
        ...updatedTest,
      });
    }
  };

  const onSwitchChange = (fieldName: string) => (
    event: React.ChangeEvent<HTMLInputElement>,
  ): void => {
    const updatedBool = event.target.checked;
    updateTest(test => ({ ...test, [fieldName]: updatedBool }));
  };

  const onLiveSwitchChange = (isOn: boolean): void => {
    updateTest(test => ({ ...test, isOn }));
  };

  const updateTargetSections = (
    tagIds: string[],
    sections: string[],
    excludedTagIds: string[],
    excludedSections: string[],
  ): void => {
    updateTest(test => ({ ...test, tagIds, sections, excludedTagIds, excludedSections }));
  };

  const onRegionsChange = (updatedRegions: Region[]): void => {
    updateTest(test => ({ ...test, locations: updatedRegions }));
  };

  const onCohortChange = (updatedCohort: UserCohort): void => {
    updateTest(test => ({ ...test, userCohort: updatedCohort }));
  };

  const onMaxViewsChange = (updatedMaxViews?: MaxEpicViews): void => {
    updateTest(test => ({
      ...test,
      alwaysAsk: !updatedMaxViews,
      maxViews: updatedMaxViews,
    }));
  };

  const onCopy = (name: string, nickname: string): void => {
    console.log({ name, nickname });
    // onTestSelected(name);
    // createTest({ ...test, name: name, nickname: nickname, isOn: false });
  };

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

      {epicEditorConfig.allowContentTargeting && (
        <div className={classes.sectionContainer}>
          <Typography variant={'h3'} className={classes.sectionHeader}>
            Target content
          </Typography>

          <EpicTestTargetContentEditor
            tagIds={test.tagIds}
            sections={test.sections}
            excludeTagIds={test.excludedTagIds}
            excludeSections={test.excludedSections}
            editMode={editMode}
            updateTargetContent={updateTargetSections}
          />
        </div>
      )}

      {epicEditorConfig.allowLocationTargeting && (
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
            showSupporterStatusSelector={epicEditorConfig.allowSupporterStatusTargeting}
          />
        </div>
      )}

      {epicEditorConfig.allowViewFrequencySettings && (
        <div className={classes.sectionContainer}>
          <Typography variant={'h3'} className={classes.sectionHeader}>
            View frequency settings
          </Typography>

          <FormControlLabel
            control={
              <Switch
                checked={test.useLocalViewLog}
                onChange={onSwitchChange('useLocalViewLog')}
                disabled={!editMode}
              />
            }
            label={`Use private view counter for this test (instead of the global one)`}
          />

          <EpicTestMaxViewsEditor
            maxEpicViews={test.alwaysAsk ? undefined : test.maxViews}
            isDisabled={!editMode}
            onMaxViewsChanged={onMaxViewsChange}
            onValidationChange={onMaxViewsValidationChange}
          />
        </div>
      )}

      <div className={classes.buttonsContainer}>
        <TestEditorActionButtons
          existingNames={testNames}
          existingNicknames={testNicknames}
          testNamePrefix={testNamePrefix}
          isDisabled={!editMode}
          onArchive={onArchive}
          onDelete={onDelete}
          onCopy={onCopy}
        />
      </div>
    </div>
  );
};

export default EpicDesignTestEditor;
