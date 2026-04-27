import SaveIcon from '@mui/icons-material/Save';
import { Autocomplete, Button, TextField, Typography } from '@mui/material';
import { Theme } from '@mui/material/styles';
import { makeStyles } from '@mui/styles';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { AmountsTest, AmountsVariant, countries, Country } from '../../utils/models';
import LiveSwitch from '../shared/liveSwitch';
import { AmountsVariantEditor } from './AmountsVariantEditor';
import { CreateVariantButton } from './CreateVariantButton';
import { DeleteTestButton } from './DeleteTestButton';

const useStyles = makeStyles(({ spacing }: Theme) => ({
  container: {
    minWidth: '500px',
  },
  emptyContainer: {
    width: '100%',
    height: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonBar: {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: spacing(2),
    marginBottom: spacing(2),
  },
  saveButtonText: {
    fontSize: '12px',
    fontWeight: 500,
    textTransform: 'uppercase',
    letterSpacing: '1px',
  },
  input: {
    '& input': {
      textTransform: 'uppercase !important',
    },
  },
  numberInput: {
    width: '160px',
  },
  note: {
    fontStyle: 'italic',
  },
}));

interface AmountsTestEditorProps {
  test: AmountsTest | undefined;
  checkLiveTestNameIsUnique: (name: string, test: string) => boolean;
  updateTest: (updatedTest: AmountsTest) => void;
  deleteTest: (name: string) => void | undefined;
  saveTest: () => void | undefined;
}

const nameErrorMessages = {
  REQUIRED: 'Live test name required',
  DUPLICATE: 'Test with this name already exists',
  OK: '',
};

const orderErrorMessages = {
  NOTANUMBER: 'Must be a number',
  NEGATIVE: 'Must be >= 0',
  OK: '',
};

const countryErrorMessages = {
  REQUIRED: 'Must include at least one country',
  OK: '',
};

interface CountryTag {
  id: Country;
  label: string;
}
const countryTags: CountryTag[] = [];
Object.entries(countries).forEach(([id, label]) => countryTags.push({ id, label }));

export const AmountsTestEditor: React.FC<AmountsTestEditorProps> = ({
  test,
  checkLiveTestNameIsUnique,
  updateTest,
  deleteTest,
  saveTest,
}: AmountsTestEditorProps) => {
  const classes = useStyles();

  const convertToCountryTag = (vals: Country[]): CountryTag[] => {
    const output: CountryTag[] = [];
    vals.forEach((id) => output.push({ id, label: countries[id] }));
    return output;
  };

  const convertFromCountryTag = useCallback((vals: CountryTag[]): Country[] => {
    const output: Country[] = [];
    vals.forEach((tag) => output.push(tag.id));
    return output;
  }, []);

  const testName = test?.testName;
  const targeting = test?.targeting;

  const [saveButtonIsDisabled, setSaveButtonIsDisabled] = useState<boolean>(true);
  const [testVariants, setTestVariants] = useState<AmountsVariant[]>([]);
  const [testIsLive, setTestIsLive] = useState<boolean>(false);

  const [currentLiveTestName, setCurrentLiveTestName] = useState<string>('');
  const [currentLiveTestError, setCurrentLiveTestError] = useState(nameErrorMessages.REQUIRED);
  const [currentOrder, setCurrentOrder] = useState(0);
  const [currentOrderError, setCurrentOrderError] = useState(orderErrorMessages.OK);
  const [currentCountry, setCurrentCountry] = useState<CountryTag[]>([]);
  const [currentCountryError, setCurrentCountryError] = useState(countryErrorMessages.OK);
  const lastTestNameRef = useRef<string>('');

  const syncTestToParent = useCallback(() => {
    if (test) {
      const t: AmountsTest = {
        ...test,
        variants: [...testVariants],
        isLive: testIsLive,
        liveTestName: currentLiveTestName,
        order: currentOrder,
        targeting:
          test.targeting.targetingType === 'Country'
            ? {
                targetingType: 'Country',
                countries: convertFromCountryTag(currentCountry),
              }
            : test.targeting,
      };
      updateTest(t);
    }
  }, [
    test,
    testVariants,
    testIsLive,
    currentLiveTestName,
    currentOrder,
    currentCountry,
    updateTest,
    convertFromCountryTag,
  ]);

  const updateLiveTestName = useCallback(
    (update: string) => {
      if (!update.trim()) {
        setCurrentLiveTestName('');
        setCurrentLiveTestError(nameErrorMessages.REQUIRED);
        setSaveButtonIsDisabled(true);
      } else {
        setCurrentLiveTestName(update.toUpperCase());
        if (checkLiveTestNameIsUnique(update, testName ?? '')) {
          setCurrentLiveTestError(nameErrorMessages.OK);
        } else {
          setCurrentLiveTestError(nameErrorMessages.DUPLICATE);
        }
        setSaveButtonIsDisabled(false);
      }
    },
    [checkLiveTestNameIsUnique, testName],
  );

  const updateOrder = useCallback((update: number) => {
    if (isNaN(update)) {
      setCurrentOrder(0);
      setCurrentOrderError(orderErrorMessages.NOTANUMBER);
      setSaveButtonIsDisabled(true);
    } else {
      setCurrentOrder(update);
      if (update < 0) {
        setCurrentOrderError(orderErrorMessages.NEGATIVE);
      } else {
        setCurrentOrderError(orderErrorMessages.OK);
      }
      setSaveButtonIsDisabled(false);
    }
  }, []);

  const updateCountry = useCallback((update: CountryTag[]) => {
    setCurrentCountry([...update]);
    if (update.length) {
      setCurrentCountryError(countryErrorMessages.OK);
      setSaveButtonIsDisabled(false);
    } else {
      setCurrentCountryError(countryErrorMessages.REQUIRED);
      setSaveButtonIsDisabled(true);
    }
  }, []);

  // Sync test prop to local state when test changes
  useEffect(() => {
    if (test && test.testName !== lastTestNameRef.current) {
      lastTestNameRef.current = test.testName;

      // Defer state updates to avoid cascading renders
      queueMicrotask(() => {
        setTestVariants(test.variants);
        setTestIsLive(test.isLive);
        setCurrentLiveTestName(test.liveTestName ?? '');
        setCurrentOrder(test.order);
        setCurrentCountry(
          test.targeting.targetingType === 'Country'
            ? convertToCountryTag(test.targeting.countries)
            : [],
        );
        setSaveButtonIsDisabled(true);

        if (!test.liveTestName?.trim()) {
          setCurrentLiveTestError(nameErrorMessages.REQUIRED);
        } else if (checkLiveTestNameIsUnique(test.liveTestName, test.testName)) {
          setCurrentLiveTestError(nameErrorMessages.OK);
        } else {
          setCurrentLiveTestError(nameErrorMessages.DUPLICATE);
        }

        setCurrentOrderError(orderErrorMessages.OK);

        const countryCount =
          test.targeting.targetingType === 'Country' ? test.targeting.countries.length : 0;
        setCurrentCountryError(
          countryCount > 0 ? countryErrorMessages.OK : countryErrorMessages.REQUIRED,
        );
      });
    }
  }, [test, checkLiveTestNameIsUnique]);

  const createVariant = (name: string) => {
    const newVariant: AmountsVariant = {
      variantName: name,
      defaultContributionType: 'MONTHLY',
      displayContributionType: ['ONE_OFF', 'MONTHLY', 'ANNUAL'],
      amountsCardData: {
        ONE_OFF: {
          amounts: [1],
          defaultAmount: 1,
          hideChooseYourAmount: false,
        },
        MONTHLY: {
          amounts: [10],
          defaultAmount: 10,
          hideChooseYourAmount: false,
        },
        ANNUAL: {
          amounts: [100],
          defaultAmount: 100,
          hideChooseYourAmount: false,
        },
      },
    };
    const newState: AmountsVariant[] = [...testVariants, newVariant];
    setTestVariants(newState);
    setSaveButtonIsDisabled(false);
    setTimeout(() => syncTestToParent(), 0);
  };

  const updateVariant = (variant: AmountsVariant) => {
    const newState: AmountsVariant[] = [];
    testVariants.forEach((v) => {
      if (v.variantName === variant.variantName) {
        newState.push(variant);
      } else {
        newState.push(v);
      }
    });
    setTestVariants(newState);
    setSaveButtonIsDisabled(false);
    setTimeout(() => syncTestToParent(), 0);
  };

  const getExistingVariantNames = () => {
    return testVariants.map((v) => v.variantName);
  };

  const deleteVariant = (variant: AmountsVariant) => {
    const deleteName = variant.variantName;
    const newState = testVariants.filter((v) => deleteName !== v.variantName);
    setTestVariants(newState);
    setSaveButtonIsDisabled(false);
    setTimeout(() => syncTestToParent(), 0);
  };

  const updateTestIsLive = () => {
    setTestIsLive(!testIsLive);
    setSaveButtonIsDisabled(false);
    setTimeout(() => syncTestToParent(), 0);
  };

  const saveCurrentTest = () => {
    syncTestToParent();
    saveTest();
    setSaveButtonIsDisabled(true);
  };

  const deleteCurrentTest = () => {
    if (testName != null) {
      deleteTest(testName);
    }
  };

  const addVariantForm = (variant: AmountsVariant) => {
    return (
      <AmountsVariantEditor
        key={`variant_key_${variant.variantName}`}
        variant={variant}
        updateVariant={updateVariant}
        deleteVariant={deleteVariant}
        isCountryTest={checkIfTestIsCountryTier()}
      />
    );
  };

  const checkIfTestIsCountryTier = () => {
    return targeting?.targetingType === 'Country';
  };

  const addButtonBar = () => {
    return (
      <div className={classes.buttonBar}>
        {checkIfTestIsCountryTier() && (
          <DeleteTestButton testName={testName ?? ''} confirmDeletion={deleteCurrentTest} />
        )}
        <CreateVariantButton
          createVariant={createVariant}
          existingNames={getExistingVariantNames()}
        />
        <Button
          variant="contained"
          color="primary"
          startIcon={<SaveIcon />}
          disabled={saveButtonIsDisabled}
          onClick={saveCurrentTest}
        >
          <Typography className={classes.saveButtonText}>Save test</Typography>
        </Button>
      </div>
    );
  };

  if (test == null) {
    return (
      <div className={classes.emptyContainer}>
        <Typography>Please select an Amounts test for editing</Typography>
      </div>
    );
  }

  return (
    <div className={classes.container}>
      <div>
        <Typography variant="h5">Amounts test: {testName}</Typography>

        <TextField
          className={classes.input}
          name="liveTestName"
          label={checkIfTestIsCountryTier() ? 'Live test name' : 'Live A/B test name'}
          value={currentLiveTestName}
          onChange={(e) => updateLiveTestName(e.target.value)}
          error={!!currentLiveTestError.length}
          helperText={currentLiveTestError}
          margin="normal"
          variant="outlined"
          fullWidth
        />

        {checkIfTestIsCountryTier() && (
          <>
            <TextField
              className={classes.numberInput}
              name="order"
              label="Test order"
              value={currentOrder}
              onChange={(e) => updateOrder(parseInt(e.target.value, 10))}
              error={!!currentOrderError.length}
              helperText={currentOrderError}
              margin="normal"
              variant="outlined"
              fullWidth={false}
              type="number"
            />

            <Autocomplete
              multiple
              id="selected-countries"
              options={countryTags}
              getOptionLabel={(opt) => opt.label}
              onChange={(event, value) => updateCountry(value)}
              value={currentCountry}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Included countries"
                  variant="outlined"
                  error={!!currentCountryError.length}
                  helperText={currentCountryError}
                />
              )}
            />
          </>
        )}

        {!checkIfTestIsCountryTier() && (
          <Typography className={classes.note}>
            Note: users arriving at the checkout page from Apple News/Google article CTAs will only
            see their region&apos;s amounts test, with options for single, monthly and annual
            contributions.
          </Typography>
        )}

        <LiveSwitch
          label={checkIfTestIsCountryTier() ? 'Test is live' : 'A/B test is live'}
          isLive={testIsLive}
          onChange={updateTestIsLive}
          isDisabled={false}
        />
        {addButtonBar()}
      </div>
      <div>{testVariants.map((v) => addVariantForm(v))}</div>
      {addButtonBar()}
    </div>
  );
};
