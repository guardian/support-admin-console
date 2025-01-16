import React from 'react';
import { Theme } from '@mui/material';
import { makeStyles } from '@mui/styles';

import { TagsEditor } from './epicTests/tagsEditor';
import { SectionsEditor } from './epicTests/sectionsEditor';
import { PageContextTargeting } from './helpers/shared';

const useStyles = makeStyles(({ spacing }: Theme) => ({
  container: {
    width: '100%',
    '& > * + *': {
      marginTop: spacing(3),
    },
  },
}));

interface TestEditorContextTargetingProps {
  contextTargeting: PageContextTargeting;
  editMode: boolean;
  updateContextTargeting: (contextTargeting: PageContextTargeting) => void;
  onlyShowExcludedTags?: boolean;
}

const TestEditorContextTargeting: React.FC<TestEditorContextTargetingProps> = ({
  contextTargeting,
  editMode,
  updateContextTargeting,
  onlyShowExcludedTags,
}: TestEditorContextTargetingProps) => {
  const classes = useStyles();

  const { tagIds, sectionIds, excludedTagIds, excludedSectionIds } = contextTargeting;

  return (
    <div className={classes.container}>
      {!onlyShowExcludedTags && (
        <TagsEditor
          label="Target tags"
          ids={tagIds}
          onUpdate={(newTagIds): void => {
            updateContextTargeting({ ...contextTargeting, tagIds: newTagIds });
          }}
          disabled={!editMode}
        />
      )}

      {!onlyShowExcludedTags && (
        <SectionsEditor
          label="Target sections"
          ids={sectionIds}
          onUpdate={(newSectionIds): void => {
            updateContextTargeting({ ...contextTargeting, sectionIds: newSectionIds });
          }}
          disabled={!editMode}
        />
      )}

      <TagsEditor
        label="Excluded tags"
        ids={excludedTagIds}
        onUpdate={(newExcludedTagIds): void => {
          updateContextTargeting({ ...contextTargeting, excludedTagIds: newExcludedTagIds });
        }}
        disabled={!editMode}
      />

      {!onlyShowExcludedTags && (
        <SectionsEditor
          label="Excluded sections"
          ids={excludedSectionIds}
          onUpdate={(newExcludedSectionIds): void => {
            updateContextTargeting({
              ...contextTargeting,
              excludedSectionIds: newExcludedSectionIds,
            });
          }}
          disabled={!editMode}
        />
      )}
    </div>
  );
};

export default TestEditorContextTargeting;
