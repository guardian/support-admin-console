import React, { useEffect, useState, ChangeEvent } from 'react';
import { Theme, makeStyles, TextField } from '@material-ui/core';

import { Autocomplete } from '@material-ui/lab';
import { TagsEditor } from "./tagsEditor";
import { SectionsEditor } from "./sectionsEditor";

const useStyles = makeStyles(({ spacing }: Theme) => ({
  container: {
    width: '100%',
    '& > * + *': {
      marginTop: spacing(3),
    },
  },
}));

interface EpicTestTargetContentEditorProps {
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

const EpicTestTargetContentEditor: React.FC<EpicTestTargetContentEditorProps> = ({
  tagIds,
  sections,
  excludeTagIds,
  excludeSections,
  editMode,
  updateTargetContent,
}: EpicTestTargetContentEditorProps) => {
  const classes = useStyles();

   return (
    <div className={classes.container}>
      <TagsEditor
        label="Target tags"
        ids={tagIds}
        onUpdate={(newTagIds) => {
          updateTargetContent(
            newTagIds,
            sections,
            excludeTagIds,
            excludeSections,
          )

        }}
        disabled={!editMode}
      />

      <SectionsEditor
        label="Target sections"
        ids={sections}
        onUpdate={(newSectionIds) => {
          updateTargetContent(
            tagIds,
            newSectionIds,
            excludeTagIds,
            excludeSections,
          )
        }}
        disabled={!editMode}
      />

      <TagsEditor
        label="Excluded tags"
        ids={excludeTagIds}
        onUpdate={(newExcludedTagIds) => {
          updateTargetContent(
            tagIds,
            sections,
            newExcludedTagIds,
            excludeSections,
          )
        }}
        disabled={!editMode}
      />

      <SectionsEditor
        label="Excluded sections"
        ids={excludeSections}
        onUpdate={(newExcludedSectionIds) => {
          updateTargetContent(
            tagIds,
            sections,
            excludeTagIds,
            newExcludedSectionIds,
          )
        }}
        disabled={!editMode}
      />
    </div>
  );
};

export default EpicTestTargetContentEditor;
