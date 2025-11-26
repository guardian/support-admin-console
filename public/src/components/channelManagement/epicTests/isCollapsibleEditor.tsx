import React from 'react';
import FormControlLabel from '@mui/material/FormControlLabel';
import { Checkbox, Radio, RadioGroup, Theme } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { CollapsibleVariant } from '../../../models/epic';

const useStyles = makeStyles(({ spacing }: Theme) => ({
  container: {
    '& > * + *': {
      marginTop: spacing(1),
    },
  },
}));

interface IsCollapsibleEditorProps {
  isCollapsible?: boolean;
  collapsibleVariant?: CollapsibleVariant;
  isDisabled: boolean;
  updateIsCollapsibleSettings: (
    isCollapsible: boolean,
    collapsibleVariant?: CollapsibleVariant,
  ) => void;
}

const IsCollapsibleEditor: React.FC<IsCollapsibleEditorProps> = ({
  isCollapsible,
  collapsibleVariant,
  isDisabled,
  updateIsCollapsibleSettings,
}: IsCollapsibleEditorProps) => {
  const classes = useStyles();

  const onRadioGroupChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    if (event.target.value === 'maybeLater') {
      updateIsCollapsibleSettings(true, 'maybeLater');
    } else if (event.target.value === 'close') {
      updateIsCollapsibleSettings(true, 'close');
    } else {
      updateIsCollapsibleSettings(false);
    }
  };

  const onChange = (): void => {
    updateIsCollapsibleSettings(!Boolean(isCollapsible), isCollapsible ? undefined : 'maybeLater');
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
      <RadioGroup row value={collapsibleVariant || ''} onChange={onRadioGroupChange}>
        <FormControlLabel
          value="maybeLater"
          key="maybeLater"
          control={<Radio />}
          label="Maybe Later (V2)"
          disabled={isDisabled}
        />
        <FormControlLabel
          value="close"
          key="close"
          control={<Radio />}
          label="Close (V1)"
          disabled={isDisabled}
        />
      </RadioGroup>
    </div>
  );
};

export default IsCollapsibleEditor;
