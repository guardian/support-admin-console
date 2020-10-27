import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Theme, makeStyles, TextField } from '@material-ui/core';

const useStyles = makeStyles(({ spacing }: Theme) => ({
  container: {
    width: '100%',
    '& > * + *': {
      marginTop: spacing(3),
    },
  },
}));

interface FormData {
  tagIds: string;
  sections: string;
  excludeTagIds: string;
  excludeSections: string;
}

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

  const defaultValues: FormData = {
    tagIds: tagIds.join(','),
    sections: sections.join(','),
    excludeTagIds: excludeTagIds.join(','),
    excludeSections: excludeSections.join(','),
  };

  const { register, handleSubmit, reset } = useForm<FormData>({ defaultValues });

  useEffect(() => {
    reset(defaultValues);
  }, [
    defaultValues.tagIds,
    defaultValues.sections,
    defaultValues.excludeTagIds,
    defaultValues.excludeSections,
  ]);

  const onSubmit = ({ tagIds, sections, excludeTagIds, excludeSections }: FormData): void => {
    updateTargetContent(
      tagIds.split(','),
      sections.split(','),
      excludeTagIds.split(','),
      excludeSections.split(','),
    );
  };

  return (
    <div className={classes.container}>
      <TextField
        inputRef={register()}
        name="tagIds"
        label="Target tags"
        helperText="Format: environment/wildlife,business/economics"
        onBlur={handleSubmit(onSubmit)}
        margin="normal"
        variant="outlined"
        disabled={!editMode}
        fullWidth
      />

      <TextField
        inputRef={register()}
        name="sections"
        label="Target sections"
        helperText="Format: environment,business"
        onBlur={handleSubmit(onSubmit)}
        margin="normal"
        variant="outlined"
        disabled={!editMode}
        fullWidth
      />

      <TextField
        inputRef={register()}
        name="excludeTagIds"
        label="Excluded tags"
        helperText="Format: environment/wildlife,business/economics"
        onBlur={handleSubmit(onSubmit)}
        margin="normal"
        variant="outlined"
        disabled={!editMode}
        fullWidth
      />

      <TextField
        inputRef={register()}
        name="excludeSections"
        label="Excluded sections"
        helperText="Format: environment,business"
        onBlur={handleSubmit(onSubmit)}
        margin="normal"
        variant="outlined"
        disabled={!editMode}
        fullWidth
      />
    </div>
  );
};

export default EpicTestTargetContentEditor;
