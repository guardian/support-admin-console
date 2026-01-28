import React from 'react';
import { TextField } from '@mui/material';
import { SingleCheckoutVariant } from '../../../models/singleCheckout';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles(() => ({
  textField: {
    marginTop: '8px',
    marginBottom: '8px',
  },
}));

interface VariantEditorProps {
  variant: SingleCheckoutVariant;
  onVariantChange: (update: (current: SingleCheckoutVariant) => SingleCheckoutVariant) => void;
  onDelete: () => void;
  editMode: boolean;
  onValidationChange: (isValid: boolean) => void;
}

const VariantEditor: React.FC<VariantEditorProps> = ({
  variant,
  onVariantChange,
  editMode,
  onValidationChange,
}: VariantEditorProps) => {
  const classes = useStyles();

  React.useEffect(() => {
    const isValid = variant.heading.trim() !== '' && variant.subheading.trim() !== '';
    onValidationChange(isValid);
  }, [variant.heading, variant.subheading, onValidationChange]);

  const onHeadingChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const newHeading = e.target.value;
    onVariantChange((current) => ({
      ...current,
      heading: newHeading,
    }));
  };

  const onSubheadingChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const newSubheading = e.target.value;
    onVariantChange((current) => ({
      ...current,
      subheading: newSubheading,
    }));
  };

  return (
    <div>
      <TextField
        className={classes.textField}
        label="Heading"
        value={variant.heading}
        onChange={onHeadingChange}
        disabled={!editMode}
        fullWidth
        required
        error={editMode && variant.heading.trim() === ''}
        helperText={editMode && variant.heading.trim() === '' ? 'Heading is required' : ''}
      />
      <TextField
        className={classes.textField}
        label="Subheading"
        value={variant.subheading}
        onChange={onSubheadingChange}
        disabled={!editMode}
        fullWidth
        required
        multiline
        rows={3}
        error={editMode && variant.subheading.trim() === ''}
        helperText={editMode && variant.subheading.trim() === '' ? 'Subheading is required' : ''}
      />
    </div>
  );
};

export default VariantEditor;
