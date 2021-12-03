import React from 'react';
import { Theme, makeStyles } from '@material-ui/core';

import { TagsEditor } from './exclude-tagsEditor';
import { SectionsEditor } from './exclude-sectionsEditor';

const useStyles = makeStyles(({ spacing }: Theme) => ({
  container: {
    width: '100%',
    '& > * + *': {
      marginTop: spacing(3),
    },
  },
}));

interface HeaderTestTargetContentEditorProps {
  tagIds: string[];
  sections: string[];
  excludeTagIds: string[];
  excludeSections: string[];
  editMode: boolean;
  updateTargetContent: (
    tagIds: string[],
    sections: string[],
    excludeTagIds: string[],
    excludeSections: string[],
  ) => void;
}

const HeaderTestTargetContentEditor: React.FC<HeaderTestTargetContentEditorProps> = ({
  tagIds,
  sections,
  excludeTagIds,
  excludeSections,
  editMode,
  updateTargetContent,
}: HeaderTestTargetContentEditorProps) => {
  const classes = useStyles();

  return (
    <div className={classes.container}>
      <TagsEditor
        label="Target tags"
        ids={tagIds}
        onUpdate={(newTagIds): void => {
          updateTargetContent(newTagIds, sections, excludeTagIds, excludeSections);
        }}
        disabled={!editMode}
      />

      <SectionsEditor
        label="Target sections"
        ids={sections}
        onUpdate={(newSectionIds): void => {
          updateTargetContent(tagIds, newSectionIds, excludeTagIds, excludeSections);
        }}
        disabled={!editMode}
      />

      <TagsEditor
        label="Excluded tags"
        ids={excludeTagIds}
        onUpdate={(newExcludedTagIds): void => {
          updateTargetContent(tagIds, sections, newExcludedTagIds, excludeSections);
        }}
        disabled={!editMode}
      />

      <SectionsEditor
        label="Excluded sections"
        ids={excludeSections}
        onUpdate={(newExcludedSectionIds): void => {
          updateTargetContent(tagIds, sections, excludeTagIds, newExcludedSectionIds);
        }}
        disabled={!editMode}
      />
    </div>
  );
};

export default HeaderTestTargetContentEditor;
