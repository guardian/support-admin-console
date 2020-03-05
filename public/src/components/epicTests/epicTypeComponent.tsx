import React from 'react';
import {
  FormControl,
  FormControlLabel,
  InputLabel,
  Radio,
  RadioGroup,
  Theme,
  WithStyles,
  createStyles,
  withStyles
} from "@material-ui/core";

const styles = ({ spacing, typography}: Theme) => createStyles({
  formControl: {
    marginTop: spacing(2),
    marginBottom: spacing(1),
    display: 'block',
  },
  selectLabel: {
    fontSize: typography.pxToRem(22),
    fontWeight: typography.fontWeightMedium,
    color: 'black'
  },
  radio: {
    paddingTop: '20px',
    marginBottom: '10px'
  },
});

export type EpicType = 'Standard' | 'LiveBlog'

interface Props extends WithStyles<typeof styles> {
  epicType: EpicType,
  isEditable: boolean,
  onEpicTypeChange: (epicType: EpicType) => void,
}

const EpicTypeComponent = (props: Props) => {
  const classes = props.classes;

  return (
    <FormControl
    className={classes.formControl}>
      <InputLabel
        className={classes.selectLabel}
        shrink
        htmlFor="epic-type">
          Epic type
      </InputLabel>
      <RadioGroup
        className={classes.radio}
        value={props.epicType}
        onChange={(event, value) => props.onEpicTypeChange(value as EpicType)}
      >
         <FormControlLabel
            value={'Standard'}
            control={<Radio />}
            label="Below articles"
            disabled={!props.isEditable}
        />
        <FormControlLabel
            value={'LiveBlog'}
            control={<Radio />}
            label="In liveblogs"
            disabled={!props.isEditable}
        />
      </RadioGroup>
  </FormControl>
  );
}

export default withStyles(styles)(EpicTypeComponent);
