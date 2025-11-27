import React from 'react';
import FormControlLabel from '@mui/material/FormControlLabel';
import { Checkbox, Theme } from '@mui/material';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles(({ spacing }: Theme) => ({
  container: {
    '& > * + *': {
      marginTop: spacing(1),
    },
  },
}));

interface IsCollapsibleEditorProps {
  isCollapsible?: boolean;
  isDisabled: boolean;
  updateIsCollapsibleSettings: (isCollapsible: boolean) => void;
}

const IsCollapsibleEditor: React.FC<IsCollapsibleEditorProps> = ({
  isCollapsible,
  isDisabled,
  updateIsCollapsibleSettings,
}: IsCollapsibleEditorProps) => {
  const classes = useStyles();

  const onChange = (): void => {
    updateIsCollapsibleSettings(!Boolean(isCollapsible));
  };

  return (
    <div className={classes.container}>
      <FormControlLabel
        control={
          <Checkbox
            checked={Boolean(isCollapsible)}
            onChange={onChange}
            color="primary"
            disabled={isDisabled}
          />
        }
        label="Two Step Banner"
      />
    </div>
  );
};

export default IsCollapsibleEditor;
