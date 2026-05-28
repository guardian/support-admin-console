import { FormControl, MenuItem, Select, Typography } from '@mui/material';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Controller, UseFormReturn } from 'react-hook-form';
import { ChoiceCardsSettings } from '../../../models/choiceCards';
import { fetchFrontendSettings, fetchTest, FrontendSettingsType } from '../../../utils/requests';
import { Test } from '../helpers/shared';
import TestListTestLiveLabel from '../testListTestLiveLabel';
import TypedRadioGroup from '../TypedRadioGroup';


interface DestinationTestsResponse {
  tests: Test[];
}

interface ChoiceCardDestinationFieldsProps {
  index: number;
  isDisabled: boolean;
  subHeadingClassName: string;
  formMethods: UseFormReturn<ChoiceCardsSettings & { hasOneDefault: boolean }>;
  onDestinationSectionChange: () => void;
}

interface DestinationTestOption {
  name: string;
  status: Test['status'];
}

enum Destination {
  LandingPage = 'LandingPage',
  Checkout = 'Checkout',
}

const startRequest = (requestRef: React.MutableRefObject<number>): number => {
  requestRef.current += 1;
  return requestRef.current;
};

const isCurrentRequest = (requestRef: React.MutableRefObject<number>, requestId: number): boolean =>
  requestRef.current === requestId;

const getSettingsTypeForDestination = (destination: Destination) =>
  destination === Destination.LandingPage
    ? FrontendSettingsType.SupportLandingPageTests
    : FrontendSettingsType.OneTimeCheckout;

export const ChoiceCardDestinationFields: React.FC<ChoiceCardDestinationFieldsProps> = ({
  index,
  isDisabled,
  subHeadingClassName,
  formMethods,
  onDestinationSectionChange,
}) => {
  const { control, getValues, setValue } = formMethods;
  const [destinationTestOptions, setDestinationTestOptions] = useState<DestinationTestOption[]>([]);
  const [destinationVariantNames, setDestinationVariantNames] = useState<string[]>([]);
  const[destinationTest, setDestinationTest] = useState<Test[]>([]);
  const destinationListRequestId = useRef(0);
  const destinationFetchRequestId = useRef(0);

  const getSafeSelectValue = (value: string | undefined, options: string[]): string =>
    value && options.includes(value) ? value : '';

  const clearVariantSelection = useCallback(() => {
    setDestinationVariantNames([]);
    setValue(`choiceCards.${index}.destinationTest.variantName`, '', {
      shouldValidate: true,
    });
  }, [index, setValue]);

  const clearTestAndVariantSelection = useCallback(() => {
    setValue(`choiceCards.${index}.destinationTest.testName`, '', {
      shouldValidate: true,
    });
    clearVariantSelection();
  }, [clearVariantSelection, index, setValue]);

  const fetchDestinationTest = useCallback(
    (testName: string) => {
      const trimmedTestName = testName.trim();

      if (!trimmedTestName) {
        clearVariantSelection();
        return;
      }

      const selectedTest = destinationTest.find(test => test.name === trimmedTestName) 
      
      if(!selectedTest)
      {
        clearVariantSelection();
        return;
      }

      const variantNames = selectedTest.variants.map((variant) => variant.name);
          setDestinationVariantNames(variantNames);

          const currentVariantName =
            getValues(`choiceCards.${index}.destinationTest.variantName`) ?? '';
          if (currentVariantName && !variantNames.includes(currentVariantName)) {
            clearVariantSelection();
          }

    },
    [clearVariantSelection, getValues, index],
  );

  const fetchDestinationTests = useCallback(
    (destination: Destination) => {
      const settingsType = getSettingsTypeForDestination(destination);
      const requestId = startRequest(destinationListRequestId);

      fetchFrontendSettings<DestinationTestsResponse>(settingsType)
        .then((response) => {
          if (!isCurrentRequest(destinationListRequestId, requestId)) {
            return;
          }

          setDestinationTest(response.tests);
          const testOptions = response.tests.map((test) => ({
            name: test.name,
            status: test.status,
          }));
          const testNames = testOptions.map((test) => test.name);
          setDestinationTestOptions(testOptions);

          const currentTestName = getValues(`choiceCards.${index}.destinationTest.testName`) ?? '';
          if (!currentTestName || !testNames.includes(currentTestName)) {
            clearTestAndVariantSelection();
            return;
          }

          fetchDestinationTest(currentTestName);
        })
        .catch(() => {
          if (!isCurrentRequest(destinationListRequestId, requestId)) {
            return;
          }

          setDestinationTestOptions([]);
          clearTestAndVariantSelection();
        });
    },
    [clearTestAndVariantSelection, fetchDestinationTest, getValues, index],
  );

  useEffect(() => {
    const destination =
      (getValues(`choiceCards.${index}.destination`) as Destination | undefined) ??
      Destination.LandingPage;
    fetchDestinationTests(destination);
  }, [fetchDestinationTests, getValues, index]);

  return (
    <Controller
      name={`choiceCards.${index}.destination`}
      control={control}
      render={({ field }) => (
        <>
          <Typography className={subHeadingClassName}>Destination</Typography>
          <TypedRadioGroup
            selectedValue={(field.value as Destination | undefined) ?? Destination.LandingPage}
            onChange={(destination) => {
              field.onChange(destination);
              fetchDestinationTests(destination);
              onDestinationSectionChange();
            }}
            isDisabled={isDisabled}
            labels={{
              [Destination.LandingPage]: 'Landing page',
              [Destination.Checkout]: 'Checkout',
            }}
          />

          <Controller
            name={`choiceCards.${index}.destinationTest.testName`}
            control={control}
            render={({ field: destinationTestNameField }) => (
              <FormControl fullWidth margin="normal" disabled={isDisabled}>
                <Select
                  required={false}
                  displayEmpty
                  value={getSafeSelectValue(
                    destinationTestNameField.value,
                    destinationTestOptions.map((test) => test.name),
                  )}
                  onChange={(e) => {
                    const selectedTestName = e.target.value;
                    destinationTestNameField.onChange(selectedTestName);
                    fetchDestinationTest(
                      selectedTestName,
                    );
                    onDestinationSectionChange();
                  }}
                >
                  <MenuItem value="">Destination test name (optional)</MenuItem>
                  {destinationTestOptions.map((test) => (
                    <MenuItem key={test.name} value={test.name}>
                      <Typography>{test.name}</Typography>
                      <TestListTestLiveLabel
                        isLive={test.status === 'Live'}
                        shouldInvertColor={false}
                      />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          />

          <Controller
            name={`choiceCards.${index}.destinationTest.variantName`}
            control={control}
            render={({ field: destinationVariantNameField }) => (
              <FormControl fullWidth margin="normal" disabled={isDisabled}>
                <Select
                  required={false}
                  displayEmpty
                  value={getSafeSelectValue(
                    destinationVariantNameField.value,
                    destinationVariantNames,
                  )}
                  onChange={(e) => {
                    destinationVariantNameField.onChange(e.target.value);
                    onDestinationSectionChange();
                  }}
                >
                  <MenuItem value="">Destination variant name (optional)</MenuItem>
                  {destinationVariantNames.map((variantName) => (
                    <MenuItem key={variantName} value={variantName}>
                      {variantName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          />
        </>
      )}
    />
  );
};
