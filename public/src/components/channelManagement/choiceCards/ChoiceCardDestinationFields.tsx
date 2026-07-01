import { FormControl, MenuItem, Select, Typography } from '@mui/material';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Controller, UseFormReturn } from 'react-hook-form';
import { ChoiceCardsSettings } from '../../../models/choiceCards';
import { fetchFrontendSettings, FrontendSettingsType } from '../../../utils/requests';
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
  const [destinationVariantNames, setDestinationVariantNames] = useState<string[]>([]);
  const [destinationTests, setDestinationTests] = useState<Test[]>([]);
  const destinationListRequestId = useRef(0);

  const getSafeSelectValue = (value: string | undefined, options: string[]): string =>
    value && options.includes(value) ? value : '';

  const clearVariantSelection = useCallback(
    (selectedTest?: Test) => {
      if (!selectedTest) {
        setDestinationVariantNames([]);
      } else {
        const variantNames = selectedTest.variants.map((variant) => variant.name);
        setDestinationVariantNames(variantNames);
      }
      setValue(`choiceCards.${index}.destinationTest.variantName`, '', {
        shouldValidate: true,
      });
    },
    [index, setValue, setDestinationVariantNames],
  );

  const clearTestAndVariantSelection = useCallback(() => {
    setValue(`choiceCards.${index}.destinationTest.testName`, '', {
      shouldValidate: true,
    });
    clearVariantSelection();
  }, [clearVariantSelection, index, setValue]);

  const setDestinationTest = useCallback(
    (testName: string, tests: Test[], variantName?: string) => {
      const trimmedTestName = testName.trim();

      if (!trimmedTestName) {
        clearVariantSelection();
        return;
      }

      const selectedTest = tests.find((test) => test.name === trimmedTestName);

      if (!selectedTest) {
        clearVariantSelection();
        return;
      }

      const variantNames = selectedTest.variants.map((variant) => variant.name);
      setDestinationVariantNames(variantNames);
      const isValidVariant = !!variantName && variantNames.includes(variantName);
      if (!isValidVariant) {
        clearVariantSelection(selectedTest);
        return;
      }
    },
    [clearVariantSelection],
  );

  //
  const getDestination = useCallback(
    (destination: Destination): Destination => {
      const isRecurringProduct = getValues(`choiceCards.${index}.product`).supportTier !== 'OneOff';
      // For recurring products, both destinations use Landing Page tests. When the landing page
      // is skipped (i.e. the banner CTA goes directly to checkout), the test journey must
      // continue on the checkout page — so the Checkout destination is used to carry the test
      // variant through to checkout.
      return isRecurringProduct ? Destination.LandingPage : destination;
    },
    [getValues, index],
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

          setDestinationTests(response.tests);

          const testNames = response.tests.map((test) => test.name);

          const currentTestName = getValues(`choiceCards.${index}.destinationTest.testName`) ?? '';
          if (!currentTestName || !testNames.includes(currentTestName)) {
            clearTestAndVariantSelection();
            return;
          }
          const currentVariantName =
            getValues(`choiceCards.${index}.destinationTest.variantName`) ?? '';

          setDestinationTest(currentTestName, response.tests, currentVariantName.trim());
        })
        .catch(() => {
          if (!isCurrentRequest(destinationListRequestId, requestId)) {
            return;
          }
          clearTestAndVariantSelection();
        });
    },
    [clearTestAndVariantSelection, setDestinationTest, getValues, index],
  );

  useEffect(() => {
    const rawDestination =
      (getValues(`choiceCards.${index}.destination`) as Destination | undefined) ??
      Destination.LandingPage;
    fetchDestinationTests(getDestination(rawDestination));
  }, [fetchDestinationTests, getDestination, getValues, index]);

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
              fetchDestinationTests(getDestination(destination));
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
                    destinationTests.map((test) => test.name),
                  )}
                  onChange={(e) => {
                    const selectedTestName = e.target.value;
                    destinationTestNameField.onChange(selectedTestName);
                    setDestinationTest(selectedTestName, destinationTests);
                    onDestinationSectionChange();
                  }}
                >
                  <MenuItem value="">Destination test name (optional)</MenuItem>
                  {destinationTests.map((test) => (
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
