import { FormHelperText, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import React, { useEffect, useRef } from 'react';
import {
  StudentLandingPageTest,
  StudentLandingPageVariant,
} from '../../../models/studentLandingPage';
import { Region } from '../../../utils/models';
import TypedRadioGroup from '../TypedRadioGroup';
import { ValidatedTestEditorProps } from '../validatedTestEditor';
import { StudentLandingPageLinkBuilder } from './studentLandingPageLinkBuilder';
import { VariantEditor } from './variantEditor';

const Section = styled('div')(({ theme }) => ({
  paddingTop: theme.spacing(1),
  paddingBottom: theme.spacing(6),
  borderBottom: `1px solid ${theme.palette.grey[500]}`,

  '& > * + *': {
    marginTop: theme.spacing(4),
  },
}));
const SectionHeader = styled(Typography)(({ theme }) => ({
  fontSize: 18,
  fontWeight: 500,
  color: theme.palette.grey[700],
}));
const ErrorText = styled('p')({
  color: 'rgba(0 0 0 / 1)',
  backgroundColor: 'rgba(255 255 0 / 1)',
  margin: '0.5em 0 0 1.5em',
});
const FormErrorText = styled(FormHelperText)({
  color: 'rgba(0 0 0 / 1)',
  backgroundColor: 'rgba(255 255 0 / 1)',
  margin: '0.5em 0 0 1.5em',
});
const ResetMargin = styled('div')({
  marginTop: 0,
});

const isFieldSet = (field: string) => {
  if (!field) {
    return false;
  }
  return true;
};

export const StudentLandingPageTestEditor: React.FC<
  ValidatedTestEditorProps<StudentLandingPageTest>
> = ({ test, userHasTestLocked, onTestChange, setValidationStatusForField }) => {
  const helperText = '';

  // Use ref to stabilize the callback and prevent infinite render loops
  const setValidationStatusRef = useRef(setValidationStatusForField);

  useEffect(() => {
    setValidationStatusRef.current = setValidationStatusForField;
  });

  useEffect(() => {
    setValidationStatusRef.current('countryGroupId', isFieldSet(test.countryGroupId));
  }, [test.countryGroupId]);

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

  const updateCountryGroupId = (updatedCountryGroupId: Region): void => {
    onTestChange((current) => ({
      ...current,
      countryGroupId: updatedCountryGroupId,
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
      <Section key={test.name}>
        <SectionHeader variant={'h3'}>Offer</SectionHeader>
        <Section key={test.name}>
          <SectionHeader variant={'h4'}>Preview link for Promotional Materials</SectionHeader>
          {!userHasTestLocked && (
            <>
              <StudentLandingPageLinkBuilder test={test} />
              <p>
                Please check the preview link is working as expected before adding to any
                promotional material.
              </p>
            </>
          )}
          {userHasTestLocked && (
            <ErrorText>
              Please update the fields below and save so that the preview link can be generated.
            </ErrorText>
          )}
        </Section>

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
      </Section>
      {/* If you need to update the countries in the labels argument, note that you will also need to adjust the route in support-frontend too */}
      <Section>
        <SectionHeader>Country</SectionHeader>
        <FormErrorText>{helperText}</FormErrorText>
        <ResetMargin>
          <TypedRadioGroup
            selectedValue={test.countryGroupId}
            onChange={updateCountryGroupId}
            isDisabled={!userHasTestLocked}
            labels={{
              AUDCountries: 'Australia',
              Canada: 'Canada',
              EURCountries: 'Europe',
              NZDCountries: 'New Zealand',
              GBPCountries: 'UK',
              UnitedStates: 'United States',
              International: 'International',
            }}
          />
        </ResetMargin>
      </Section>
    </>
  );
};
