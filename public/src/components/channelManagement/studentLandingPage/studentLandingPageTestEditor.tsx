// TODO: fix the unused variables then delete the line below.
/* eslint-disable @typescript-eslint/no-unused-vars */

import React from 'react';
import { StudentLandingPageTest } from '../../../models/studentLandingPage';
import { ValidatedTestEditorProps } from '../validatedTestEditor';
import { Typography } from '@mui/material';
import { useStyles } from '../helpers/testEditorStyles'; // TODO: is this appropriate (shared)
import { VariantEditor } from './variantEditor';

export const StudentLandingPageTestEditor: React.FC<ValidatedTestEditorProps<
  StudentLandingPageTest
>> = ({ test, userHasTestLocked, onTestChange, setValidationStatusForField }) => {
  const classes = useStyles();

  return (
    <div className={classes.sectionContainer} key={test.name}>
      <Typography variant={'h3'} className={classes.sectionHeader}>
        Offer
      </Typography>

      <div>
        <VariantEditor
          key={test.variants[0].name}
          variant={test.variants[0]}
          editMode={userHasTestLocked}
          onValidationChange={(isValid: boolean): void =>
            setValidationStatusForField(test.variants[0].name, isValid)
          }
        />
      </div>
    </div>
  );
};
