import React, { useState, useEffect } from 'react';

import { Typography, Button, TextField } from '@material-ui/core';
import SaveIcon from '@material-ui/icons/Save';
import { makeStyles, Theme } from '@material-ui/core/styles';
import LiveSwitch from '../shared/liveSwitch';

import { AmountsVariantEditor } from './AmountsVariantEditor';
import { CreateVariantButton } from './CreateVariantButton';
import { DeleteTestButton } from './DeleteTestButton';

import { AmountsTest, AmountsVariant } from '../../utils/models';

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
    width: '120px',
  },
}));

interface AmountsTestEditorProps {
  test: AmountsTest | undefined;
  checkTestNameIsUnique: (name: string) => boolean;
  updateTest: (updatedTest: AmountsTest) => void;
  deleteTest: (test: AmountsTest) => void | undefined;
  saveTest: () => void | undefined;
}

const nameErrorMessages = {
  REQUIRED: 'Live test name required',
  DUPLICATE: 'Test with this name already exists',
  OK: '',
};

const orderErrorMessages = {
  NOTANUMBER: 'Order value must be a number',
  NEGATIVE: 'Order value should be >= 0',
  OK: '',
};

export const AmountsTestEditor: React.FC<AmountsTestEditorProps> = ({
  test,
  checkTestNameIsUnique,
  updateTest,
  deleteTest,
  saveTest,
}: AmountsTestEditorProps) => {
  const classes = useStyles();

  if (test == null) {
    return (
      <div className={classes.emptyContainer}>
        <Typography>Please select an Amounts test for editing</Typography>
      </div>
    );
  }

  const {
    testName,
    liveTestName,
    testLabel,
    isLive = false,
    region,
    country,
    order,
    seed,
    variants,
  } = test;

  const [saveButtonIsDisabled, setSaveButtonIsDisabled] = useState<boolean>(true);
  const [testVariants, setTestVariants] = useState<AmountsVariant[]>([]);
  const [testIsLive, setTestIsLive] = useState<boolean>(isLive);

  const [currentLiveTestName, setCurrentLiveTestName] = useState<string | undefined>(liveTestName);
  const [currentLiveTestError, setCurrentLiveTestError] = useState(nameErrorMessages.REQUIRED);
  const [currentOrder, setCurrentOrder] = useState(order || 0);
  const [currentOrderError, setCurrentOrderError] = useState(orderErrorMessages.OK);

  useEffect(() => {
    if (test != null && variants != null) {
      setTestVariants([...variants]);
      setTestIsLive(isLive);
      updateLiveTestName(liveTestName || '');
      updateOrder(order || 0);
    }
  }, [test]);

  useEffect(() => {
    if (test != null && testVariants.length) {
      const t: AmountsTest = {
        ...test,
        variants: [...testVariants],
        isLive: testIsLive,
        liveTestName: currentLiveTestName,
        order: currentOrder,
      };
      updateTest(t);
    }
  }, [testVariants, testIsLive, currentLiveTestName, currentOrder]);

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
  };

  const updateLiveTestName = (update: string) => {
    if (!update || !update.trim()) {
      setCurrentLiveTestName('');
      setCurrentLiveTestError(nameErrorMessages.REQUIRED);
      setSaveButtonIsDisabled(true);
    } else {
      setCurrentLiveTestName(update.toUpperCase());
      if (checkTestNameIsUnique(update)) {
        setCurrentLiveTestError(nameErrorMessages.OK);
      } else {
        setCurrentLiveTestError(nameErrorMessages.DUPLICATE);
      }
      setSaveButtonIsDisabled(false);
    }
  };

  const updateOrder = (update: number) => {
    if (update == null || isNaN(update)) {
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
  };

  const updateVariant = (variant: AmountsVariant) => {
    const newState: AmountsVariant[] = [];
    testVariants.forEach(v => {
      if (v.variantName === variant.variantName) {
        newState.push(variant);
      } else {
        newState.push(v);
      }
    });
    setTestVariants(newState);
    setSaveButtonIsDisabled(false);
  };

  // const updateCountry = (countries: string[]) => {
  //   const uniques = new Set(countries);
  //   const newState: string[] = [];
  //   uniques.forEach((val) => {

  //   });
  // }

  const getExistingVariantNames = () => {
    return testVariants.map(v => v.variantName);
  };

  const deleteVariant = (variant: AmountsVariant) => {
    const deleteName = variant.variantName;
    const newState = testVariants.filter(v => deleteName !== v.variantName);
    setTestVariants(newState);
    setSaveButtonIsDisabled(false);
  };

  const updateTestIsLive = () => {
    setTestIsLive(!testIsLive);
    setSaveButtonIsDisabled(false);
  };

  const saveCurrentTest = () => {
    if (testName != null && seed != null) {
      saveTest();
      setSaveButtonIsDisabled(true);
    }
  };

  const deleteCurrentTest = () => {
    if (testName != null && seed != null) {
      deleteTest({
        testName,
        liveTestName: currentLiveTestName,
        testLabel,
        isLive: testIsLive,
        region,
        country,
        order: currentOrder,
        seed,
        variants: testVariants,
      });
    }
  };

  const addVariantForm = (variant: AmountsVariant) => {
    return (
      <AmountsVariantEditor
        key={`variant_key_${variant.variantName}`}
        variant={variant}
        updateVariant={updateVariant}
        deleteVariant={deleteVariant}
      />
    );
  };

  const checkIfTestIsCountryTier = () => {
    return region === '';
  };

  const addButtonBar = () => {
    return (
      <div className={classes.buttonBar}>
        {checkIfTestIsCountryTier() && (
          <DeleteTestButton testName={testName} confirmDeletion={deleteCurrentTest} />
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

  return (
    <div className={classes.container}>
      <div>
        <Typography variant="h5">Amounts test: {testName}</Typography>

        <TextField
          className={classes.input}
          name="testName"
          label="Test default (evergreen) name"
          value={testName}
          margin="normal"
          variant="outlined"
          disabled={true}
          fullWidth
        />

        <TextField
          className={classes.input}
          name="liveTestName"
          label={checkIfTestIsCountryTier() ? 'Live test name' : 'Live A/B test name'}
          value={currentLiveTestName}
          onChange={e => updateLiveTestName(e.target.value)}
          error={!!currentLiveTestError.length}
          helperText={currentLiveTestError}
          margin="normal"
          variant="outlined"
          fullWidth
        />

        {checkIfTestIsCountryTier() && (
          <TextField
            className={classes.numberInput}
            name="order"
            label="Test order"
            value={currentOrder}
            onChange={e => updateOrder(parseInt(e.target.value, 10))}
            error={!!currentOrderError.length}
            helperText={currentOrderError}
            margin="normal"
            variant="outlined"
            fullWidth={false}
            type="number"
          />
        )}

        <LiveSwitch
          label={checkIfTestIsCountryTier() ? 'Test is live' : 'A/B test is live'}
          isLive={testIsLive}
          onChange={updateTestIsLive}
          isDisabled={false}
        />
        {addButtonBar()}
      </div>
      <div>{testVariants.map(v => addVariantForm(v))}</div>
      {addButtonBar()}
    </div>
  );
};
