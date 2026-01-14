// TODO: fix the unused variables then delete the line below.
/* eslint-disable @typescript-eslint/no-unused-vars */

import React from 'react';
import {
  StudentLandingPageTest,
  StudentLandingPageVariant,
} from '../../../models/studentLandingPage';
import { ValidatedTestEditorProps } from '../validatedTestEditor';
import { Typography } from '@mui/material';
import { useStyles } from '../helpers/testEditorStyles'; // TODO: is this appropriate (shared)
import { getDefaultVariant } from './utils/defaults';
import { VariantEditor } from './variantEditor';

export const StudentLandingPageTestEditor: React.FC<ValidatedTestEditorProps<
  StudentLandingPageTest
>> = ({ test, userHasTestLocked, onTestChange, setValidationStatusForField }) => {
  const classes = useStyles();

  // TODO: a bunch of stuff!
  const onVariantChange = (variantName: string) => (
    update: (current: StudentLandingPageVariant) => StudentLandingPageVariant,
  ): void => {
    // TODO: something later.
  };

  console.log(`test is ${JSON.stringify(test)}`);

  const createVariant = (name: string): void => {
    const newVariant: StudentLandingPageVariant = {
      ...getDefaultVariant(),
      name: name,
    };
    // onVariantsChange(current => [...current, newVariant]); // TODO: need to save changes?
  };

  const onVariantDelete = (variantName: string) => {
    // TODO: sort this out
  };

  return (
    <div className={classes.sectionContainer} key={test.name}>
      <Typography variant={'h3'} className={classes.sectionHeader}>
        Copy
      </Typography>

      <div>
        <VariantEditor
          key={test.variants[0].name}
          variant={test.variants[0]}
          editMode={userHasTestLocked}
          onVariantChange={onVariantChange(test.variants[0].name)}
          onDelete={(): void => onVariantDelete(test.variants[0].name)}
          onValidationChange={(isValid: boolean): void =>
            setValidationStatusForField(test.variants[0].name, isValid)
          }
        />
      </div>
    </div>
  );
};
