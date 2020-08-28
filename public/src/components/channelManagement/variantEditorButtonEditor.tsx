import React from 'react';
import {
  Checkbox,
  createStyles,
  FormControlLabel,
  Theme,
  WithStyles,
  withStyles,
} from '@material-ui/core';
import EditableTextField from './editableTextField';
import { Cta } from './helpers/shared';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const styles = ({ spacing }: Theme) =>
  createStyles({
    container: {
      '& > * + *': {
        marginTop: spacing(1),
      },
    },
    fieldsContainer: {
      '& > * + *': {
        marginTop: spacing(3),
      },
    },
  });

interface VariantEditorButtonEditorProps extends WithStyles<typeof styles> {
  label: string;
  cta?: Cta;
  updateCta: (updatedCta?: Cta) => void;
  defaultCta: Cta;
  isDisabled: boolean;
}

const VariantEditorButtonEditor: React.FC<VariantEditorButtonEditorProps> = ({
  classes,
  label,
  cta,
  updateCta,
  defaultCta,
  isDisabled,
}: VariantEditorButtonEditorProps) => {
  const isChecked = cta !== undefined;

  const onCheckboxChanged = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const isChecked = event.target.checked;
    if (isChecked) {
      updateCta(defaultCta);
    } else {
      updateCta(undefined);
    }
  };

  const onTextChanged = (updatedText: string): void => {
    updateCta({ ...cta, text: updatedText });
  };

  const onBaseUrlChanged = (updatedBaseUrl: string): void => {
    updateCta({ ...cta, baseUrl: updatedBaseUrl });
  };

  return (
    <div className={classes.container}>
      <FormControlLabel
        control={
          <Checkbox
            checked={isChecked}
            onChange={onCheckboxChanged}
            color="primary"
            disabled={isDisabled}
          />
        }
        label={label}
      />

      {isChecked && (
        <div className={classes.fieldsContainer}>
          <EditableTextField
            text={cta?.text || ''}
            onSubmit={onTextChanged}
            label="Button copy"
            editEnabled={!isDisabled}
            fullWidth
          />
          <EditableTextField
            text={cta?.baseUrl || ''}
            onSubmit={onBaseUrlChanged}
            label="Button destination"
            editEnabled={!isDisabled}
            fullWidth
          />
        </div>
      )}
    </div>
  );
};

export default withStyles(styles)(VariantEditorButtonEditor);
