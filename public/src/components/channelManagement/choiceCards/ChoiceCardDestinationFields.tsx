import { FormControl, MenuItem, Select, Typography } from '@mui/material';
import React, { useCallback, useRef, useState } from 'react';
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
  const shouldInvertColor = false;
  const { control, getValues, setValue } = formMethods;
  const [destinationTestOptions, setDestinationTestOptions] = useState<DestinationTestOption[]>([]);
  const [destinationVariantNames, setDestinationVariantNames] = useState<string[]>([]);
  const destinationListRequestId = useRef(0);
  const destinationFetchRequestId = useRef(0);

  const getSafeSelectValue = (value: string | undefined, options: string[]): string =>
    value && options.includes(value) ? value : '';

  const fetchDestinationTest = useCallback(
    (destination: Destination, testName: string) => {
      const trimmedTestName = testName.trim();

      if (!trimmedTestName) {
        setDestinationVariantNames([]);
        setValue(`choiceCards.${index}.destinationTest.variantName`, '', {
          shouldValidate: true,
        });
        return;
      }

      const settingsType = getSettingsTypeForDestination(destination);

      const requestId = destinationFetchRequestId.current + 1;
      destinationFetchRequestId.current = requestId;

      fetchTest<Test>(settingsType, trimmedTestName)
        .then((test) => {
          if (destinationFetchRequestId.current !== requestId) {
            return;
          }

          const variantNames = test.variants.map((variant) => variant.name);
          setDestinationVariantNames(variantNames);

          const currentVariantName =
            getValues(`choiceCards.${index}.destinationTest.variantName`) ?? '';
          if (currentVariantName && !variantNames.includes(currentVariantName)) {
            setValue(`choiceCards.${index}.destinationTest.variantName`, '', {
              shouldValidate: true,
            });
          }
        })
        .catch(() => {
          if (destinationFetchRequestId.current !== requestId) {
            return;
          }

          setDestinationVariantNames([]);
          setValue(`choiceCards.${index}.destinationTest.variantName`, '', {
            shouldValidate: true,
          });
        });
    },
    [getValues, setValue, index],
  );

  const fetchDestinationTests = useCallback(
    (destination: Destination) => {
      const settingsType = getSettingsTypeForDestination(destination);
      const requestId = destinationListRequestId.current + 1;
      destinationListRequestId.current = requestId;

      fetchFrontendSettings<DestinationTestsResponse>(settingsType)
        .then((response) => {
          if (destinationListRequestId.current !== requestId) {
            return;
          }

          const testOptions = response.tests.map((test) => ({
            name: test.name,
            status: test.status,
          }));
          const testNames = testOptions.map((test) => test.name);
          setDestinationTestOptions(testOptions);

          const currentTestName = getValues(`choiceCards.${index}.destinationTest.testName`) ?? '';
          if (!currentTestName || !testNames.includes(currentTestName)) {
            setValue(`choiceCards.${index}.destinationTest.testName`, '', {
              shouldValidate: true,
            });
            setDestinationVariantNames([]);
            setValue(`choiceCards.${index}.destinationTest.variantName`, '', {
              shouldValidate: true,
            });
            return;
          }

          fetchDestinationTest(destination, currentTestName);
        })
        .catch(() => {
          if (destinationListRequestId.current !== requestId) {
            return;
          }

          setDestinationTestOptions([]);
          setDestinationVariantNames([]);
          setValue(`choiceCards.${index}.destinationTest.testName`, '', {
            shouldValidate: true,
          });
          setValue(`choiceCards.${index}.destinationTest.variantName`, '', {
            shouldValidate: true,
          });
        });
    },
    [getValues, setValue, fetchDestinationTest, index],
  );

  React.useEffect(() => {
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
                      (field.value as Destination | undefined) ?? Destination.LandingPage,
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
                        shouldInvertColor={shouldInvertColor}
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
