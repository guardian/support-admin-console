// TODO: fix the unused variables then delete the line below.
/* eslint-disable @typescript-eslint/no-unused-vars */

import React, { useState } from 'react';
import {
  StudentLandingPageTest,
  StudentLandingPageVariant,
} from '../../../models/studentLandingPage';
import { ValidatedTestEditorProps } from '../validatedTestEditor';
import { FormHelperText, Theme, Typography } from '@mui/material';
import { VariantEditor } from './variantEditor';
import TypedRadioGroup from '../TypedRadioGroup';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles(({ spacing, palette }: Theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    width: '100%',
    background: palette.background.paper, // #FFFFFF
  },
  sectionContainer: {
    paddingTop: spacing(1),
    paddingBottom: spacing(6),
    borderBottom: `1px solid ${palette.grey[500]}`,

    '& > * + *': {
      marginTop: spacing(4),
    },
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: 500,
    color: palette.grey[700],
  },
  variantsHeaderContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  buttonsContainer: {
    paddingTop: spacing(4),
    paddingBottom: spacing(12),
  },
  variantsHeaderButtonsContainer: {
    display: 'flex',
    '& > * + *': {
      marginLeft: spacing(2),
    },
  },
  errorText: {
    color: 'rgba(0 0 0 / 1)',
    backgroundColor: 'rgba(255 255 0 / 1)',
    margin: '0.5em 0 0 1.5em',
  },
  resetMargin: {
    marginTop: 0,
  },
}));

export const StudentLandingPageTestEditor: React.FC<
  ValidatedTestEditorProps<StudentLandingPageTest>
> = ({ test, userHasTestLocked, onTestChange, setValidationStatusForField }) => {
  const classes = useStyles();

  const [helperText, setHelperText] = useState<string>('Please choose a country');

  const updateTest = (
    update: (current: StudentLandingPageTest) => StudentLandingPageTest,
  ): void => {
    onTestChange((current) => {
      const updatedTest = update(current);
      return {
        ...updatedTest,
      };
    });
  };

  const updateCountry = (updatedCountry: string): void => {
    if (updatedCountry.length < 2) {
      setHelperText('Please choose a country');
    } else {
      setHelperText('');
    }
    onTestChange((current) => ({
      ...current,
      country: updatedCountry,
    }));
  };

  const onVariantsChange = (
    update: (current: StudentLandingPageVariant[]) => StudentLandingPageVariant[],
  ): void => {
    updateTest((current) => {
      const updatedVariantList = update(current.variants);
      return { ...current, variants: updatedVariantList };
    });
  };

  const onVariantChange =
    (variantName: string) =>
    (update: (current: StudentLandingPageVariant) => StudentLandingPageVariant): void => {
      onVariantsChange((current) =>
        current.map((variant) => {
          if (variant.name === variantName) {
            return update(variant);
          }
          return variant;
        }),
      );
    };

  return (
    <>
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

      {/* If you need to update the countries in the labels argument, note that you will also need to adjust the route in support-frontend too */}
      <div className={classes.sectionContainer}>
        <Typography className={classes.sectionHeader}>Country</Typography>
        <FormHelperText className={classes.errorText}>{helperText}</FormHelperText>
        <div className={classes.resetMargin}>
          <TypedRadioGroup
            selectedValue={test.country}
            onChange={updateCountry}
            isDisabled={!userHasTestLocked}
            labels={{
              au: 'Australia',
              nz: 'New Zealand',
            }}
          />
        </div>
      </div>
    </>
  );
};
