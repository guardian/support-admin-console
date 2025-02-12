import React from 'react';
import { Theme } from '@mui/material';
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

  const setValidationStatusForField = useValidation(onValidationChange ?? (() => {}));

  return (
    <>
      <div className={classes.sectionHeader}>
        <VariantContentEditor
          copy={variant.copy}
          onChange={(updatedCopy: SupportLandingPageCopy): void =>
            onVariantChange({ ...variant, copy: updatedCopy })
          }
          onValidationChange={(isValid): void => setValidationStatusForField('copy', isValid)}
          editMode={editMode}
        />
      </div>
    </>
  );
};

export default ConfigureComponentsEditor;
