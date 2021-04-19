import React from 'react';
import {
  Checkbox,
  createStyles,
  FormControlLabel,
  Theme,
  WithStyles,
  withStyles,
} from '@material-ui/core';
import { Cta } from './helpers/shared';
import VariantEditorCtaFieldsEditor from './variantEditorCtaFieldsEditor';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const styles = ({ spacing }: Theme) =>
  createStyles({
    container: {
      '& > * + *': {
        marginTop: spacing(1),
      },
    },
    checkboxContainer: {
      height: '50px',
    },
    fieldsContainer: {
      '& > * + *': {
        marginTop: spacing(3),
      },
    },
  });

interface VariantEditorCtaEditorProps extends WithStyles<typeof styles> {
  label: string;
  cta?: Cta;
  updateCta: (updatedCta?: Cta) => void;
  onValidationChange: (isValid: boolean) => void;
  defaultCta: Cta;
  isDisabled: boolean;
}

const VariantEditorCtaEditor: React.FC<VariantEditorCtaEditorProps> = ({
  classes,
  label,
  cta,
  updateCta,
  onValidationChange,
  defaultCta,
  isDisabled,
}: VariantEditorCtaEditorProps) => {
  const isChecked = cta !== undefined;

  const onCheckboxChanged = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const isChecked = event.target.checked;
    updateCta(isChecked ? defaultCta : undefined);
  };

  return (
    <div className={classes.container}>
      <div className={classes.checkboxContainer}>
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
      </div>

      {cta && (
        <div className={classes.fieldsContainer}>
          <VariantEditorCtaFieldsEditor
            cta={cta}
            updateCta={updateCta}
            onValidationChange={onValidationChange}
            isDisabled={isDisabled}
          />
        </div>
      )}
    </div>
  );
};

export default withStyles(styles)(VariantEditorCtaEditor);
