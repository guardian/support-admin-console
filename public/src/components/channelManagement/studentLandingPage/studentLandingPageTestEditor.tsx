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
import { VariantEditor } from './variantEditor';

export const StudentLandingPageTestEditor: React.FC<ValidatedTestEditorProps<
  StudentLandingPageTest
>> = ({ test, userHasTestLocked, onTestChange, setValidationStatusForField }) => {
  const classes = useStyles();

  const updateTest = (
    update: (current: StudentLandingPageTest) => StudentLandingPageTest,
  ): void => {
    onTestChange(current => {
      const updatedTest = update(current);
      return {
        ...updatedTest,
      };
    });
  };

  const onVariantsChange = (
    update: (current: StudentLandingPageVariant[]) => StudentLandingPageVariant[],
  ): void => {
    updateTest(current => {
      const updatedVariantList = update(current.variants);
      return { ...current, variants: updatedVariantList };
    });
  };

  const onVariantChange = (variantName: string) => (
    update: (current: StudentLandingPageVariant) => StudentLandingPageVariant,
  ): void => {
    onVariantsChange(current =>
      current.map(variant => {
        if (variant.name === variantName) {
          return update(variant);
        }
        return variant;
      }),
    );
  };

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
          onVariantChange={onVariantChange(test.variants[0].name)}
          onValidationChange={(isValid: boolean): void =>
            setValidationStatusForField(test.variants[0].name, isValid)
          }
        />
      </div>
    </div>
  );
};
