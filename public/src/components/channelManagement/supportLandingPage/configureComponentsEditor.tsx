import React, { useState } from 'react';
import { Checkbox, FormControlLabel, Theme } from '@mui/material';
import { makeStyles } from '@mui/styles';
import {
  SupportLandingPageCopy,
  SupportLandingPageVariant,
} from '../../../models/supportLandingPage';
import { VariantContentEditor } from './variantEditor';
import useValidation from '../hooks/useValidation';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const useStyles = makeStyles(({ palette, spacing }: Theme) => ({
  container: {
    width: '100%',
    paddingTop: spacing(2),
    paddingLeft: spacing(4),
    paddingRight: spacing(10),
    paddingBottom: spacing(4),

    '& > * + *': {
      marginTop: spacing(3),
    },
  },
  hook: {
    maxWidth: '400px',
  },
  sectionHeader: {
    fontSize: 16,
    color: palette.grey[900],
    fontWeight: 500,
  },
  sectionContainer: {
    paddingTop: spacing(2),
    paddingBottom: spacing(2),
    borderBottom: `1px solid ${palette.grey[500]}`,
    '& > * + *': {
      marginTop: spacing(3),
    },
  },
  contentContainer: {
    marginLeft: spacing(2),
  },
  buttonsContainer: {
    marginTop: spacing(2),
  },
  switchContainer: {
    display: 'flex',
    alignItems: 'center',

    '& > * + *': {
      marginLeft: spacing(1),
    },
  },
  switchLabel: {
    fontSize: '14px',
    fontWeight: 500,
  },
}));

interface CheckboxOption {
  label: string;
  action: () => void;
}

interface ConfigureComponentsEditorProps {
  variant: SupportLandingPageVariant;
  onVariantChange: (updatedVariant: SupportLandingPageVariant) => void;
  copy: SupportLandingPageCopy;
  onChange?: (updatedCopy: SupportLandingPageCopy) => void;
  onValidationChange?: (isValid: boolean) => void;
  editMode: boolean;
}

const ConfigureComponentsEditor: React.FC<ConfigureComponentsEditorProps> = ({
  variant,
  onVariantChange,
  onValidationChange,
  editMode,
}: ConfigureComponentsEditorProps) => {
  const classes = useStyles();

  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);

  const options: CheckboxOption[] = [
    {
      label: 'Configure Header Copy',
      action: () => {
        setShowHeader(!showHeader);
      },
    },
    {
      label: 'Configure Body Copy',
      action: () => {
        setShowSubheading(!showSubheading);
      },
    },
    {
      label: 'Configure Tabs',
      action: () => {
        console.log('Tabs selected!');
      },
    },
    {
      label: 'Configure Benefits',
      action: () => {
        console.log('Benefits selected!');
      },
    },
    {
      label: 'Configure Pills',
      action: () => {
        console.log('Pills selected!');
      },
    },
    {
      label: 'Configure Single Contributions',
      action: () => {
        console.log('Single Contribution selected!');
      },
    },
  ];

  const [showHeader, setShowHeader] = useState<boolean>(false);
  const [showSubheading, setShowSubheading] = useState<boolean>(false);

  const handleCheckboxChange = (option: CheckboxOption) => {
    if (selectedOptions.includes(option.label)) {
      option.action();
      setSelectedOptions(selectedOptions.filter(item => item !== option.label));
      onVariantChange({ ...variant, components: selectedOptions });
    } else {
      setSelectedOptions([...selectedOptions, option.label]);
      option.action();
      const componentIndex = variant.components?.indexOf(option.label);
      onVariantChange({
        ...variant,
        components: selectedOptions.filter((_, index) => index !== componentIndex),
      });
    }
  };

  const setValidationStatusForField = useValidation(onValidationChange ?? (() => {}));

  return (
    <>
      <div className={classes.contentContainer}>
        {options.map(option => (
          <div key={option.label}>
            <FormControlLabel
              control={
                <Checkbox
                  id={option.label}
                  checked={
                    variant.components?.includes(option.label) ||
                    selectedOptions.includes(option.label)
                  }
                  onChange={() => handleCheckboxChange(option)}
                  color="primary"
                  disabled={!editMode}
                  value={option.label}
                />
              }
              label={option.label}
            />
          </div>
        ))}
      </div>

      <VariantContentEditor
        copy={variant.copy}
        onChange={(updatedCopy: SupportLandingPageCopy): void =>
          onVariantChange({ ...variant, copy: updatedCopy })
        }
        onValidationChange={(isValid): void => setValidationStatusForField('copy', isValid)}
        editMode={editMode}
        showHeader={showHeader}
        showSubheading={showSubheading}
      />
    </>
  );
};

export default ConfigureComponentsEditor;
