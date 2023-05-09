import React, { useState, useEffect } from 'react';

import { Typography, Button, TextField } from '@material-ui/core';
import SaveIcon from '@material-ui/icons/Save';
import { makeStyles, Theme } from '@material-ui/core/styles';
import LiveSwitch from '../shared/liveSwitch';

import { AmountsVariantEditor } from './AmountsVariantEditor';
import { CreateVariantButton } from './CreateVariantButton';
import { DeleteTestButton } from './DeleteTestButton';

import { 
  AmountsTest,
  AmountsVariant,
  Territory,
  Regions,
} from '../../utils/models';

const useStyles = makeStyles(({ spacing }: Theme) => ({
  container: {},
  emptyContainer: {},
  formHead: {},
  formBody: {},
  buttonBar: {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: spacing(2),
    marginBottom: spacing(2),
  },
  addVariantButton: {},
  deleteTestButton: {},
  saveButton: {},
  saveButtonText: {},
  input: {
    '& input': {
      textTransform: 'uppercase !important',
    },
  }
}));

interface AmountsTestEditorProps {
  test: AmountsTest | undefined;
  testNames: string[];
  updateTest: (updatedTest: AmountsTest) => void;
  deleteTest: (test: AmountsTest) => void | undefined;
  saveTest: () => void | undefined;
}

const regionLabels = Object.keys(Regions);

const errorMessages = {
  REQUIRED: 'Live test name required',
  DUPLICATE: 'Test with this name already exists',
  OK: '',
}

export const AmountsTestEditor: React.FC<AmountsTestEditorProps> = ({
  test,
  testNames,
  updateTest,
  deleteTest,
  saveTest,
}: AmountsTestEditorProps) => {
  const classes = useStyles();

  const testName = test?.testName;
  const liveTestName = test?.liveTestName;
  const isLive = test?.isLive || false;
  const target = test?.target;
  const seed = test?.seed;
  const variants = test?.variants;

  const [saveButtonIsDisabled, setSaveButtonIsDisabled] = useState<boolean>(true);
  const [testVariants, setTestVariants] = useState<AmountsVariant[]>([]);
  const [testIsLive, setTestIsLive] = useState<boolean>(isLive);

  const [currentLiveTestName, setCurrentLiveTestName] = useState<string | undefined>(liveTestName);
  const [currentLiveTestError, setCurrentLiveTestError] = useState(errorMessages.REQUIRED);

  useEffect(() => {
    if (test != null && variants != null) {
      setTestVariants([...variants]);
      setTestIsLive(isLive);
      updateLiveTestName(liveTestName || '');
    }
  }, [test]);

  useEffect(() => {
    if (test != null && testVariants.length) {
      const t: AmountsTest = {
        ...test,
        variants: [...testVariants],
        isLive: testIsLive,
        liveTestName: currentLiveTestName,
      } 
      updateTest(t);
    }
  }, [testVariants, testIsLive, currentLiveTestName]);

  if (test == null) {
    return (
      <div className={classes.emptyContainer}>
        <Typography>Please select an Amounts test for editing</Typography>
     </div>
    );
  }

  const createVariant = (name: string) => {
    const newVariant: AmountsVariant = {
      variantName: name,
      defaultContributionType: 'MONTHLY',
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

  const updateLiveTestName = (val: string) => {
    const updatedName = val.toUpperCase();
    setCurrentLiveTestName(updatedName);
    if (!updatedName.length) {
      setCurrentLiveTestError(errorMessages.REQUIRED);
    }
    else if (testNames.includes(updatedName)) {
      setCurrentLiveTestError(errorMessages.DUPLICATE);
    }
    else {
      setCurrentLiveTestError(errorMessages.OK);
    }
    setSaveButtonIsDisabled(false);
  };

  const updateVariant = (variant: AmountsVariant) => {
    const newState: AmountsVariant[] = [];
    testVariants.forEach(v => {
      if (v.variantName === variant.variantName) {
        newState.push(variant);
      }
      else {
        newState.push(v);
      }
    });
    setTestVariants(newState);
    setSaveButtonIsDisabled(false);
  }

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
    if (testName != null && target != null && seed != null) {
      saveTest();
      setSaveButtonIsDisabled(true);
    }
  };

  const deleteCurrentTest = () => {
    if (testName != null && target != null && seed != null) {
      deleteTest({
         testName, 
         liveTestName,
         isLive: testIsLive,
         target, 
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
        testIsCountryTier={checkIfTestIsCountryTier()}
      />
    );
  };

  const checkIfTestIsCountryTier = () => {
    return (target != null && !regionLabels.includes(target as string)) ? true : false;
  }

  const addButtonBar = () => {
    return (
      <div className={classes.buttonBar}>
        {checkIfTestIsCountryTier() && (
          <DeleteTestButton
            testName={target as string}
            confirmDeletion={deleteCurrentTest} 
          />
        )}
        <CreateVariantButton 
          createVariant={createVariant}
          existingNames={getExistingVariantNames()}
        />
        <Button
          variant="contained"
          color="primary"
          className={classes.saveButton}
          startIcon={<SaveIcon />}
          disabled={saveButtonIsDisabled}
          onClick={saveCurrentTest}
        >
          <Typography className={classes.saveButtonText}>Save test</Typography>
        </Button>
      </div>
    )
  };

  return (
    <div className={classes.container}>
      <div className={classes.formHead}>
        <div>
          <Typography variant="h5">Amounts tests for: {target}</Typography>

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
            name="name"
            label="Live A/B test name"
            value={currentLiveTestName}
            onChange={e => updateLiveTestName(e.target.value)}
            error={!!currentLiveTestError.length}
            helperText={currentLiveTestError}
            margin="normal"
            variant="outlined"
            fullWidth
          />

          <LiveSwitch
            label="Control vs variants A/B test is live"
            isLive={testIsLive}
            onChange={updateTestIsLive}
            isDisabled={false}
          />
          {addButtonBar()}
        </div>
      </div>
      <div className={classes.formBody}>
        {testVariants.map(v => addVariantForm(v))}
      </div>
      {addButtonBar()}
   </div>
  );
};

  // const updateIsLive = (isLive: boolean): void => {
  //   updateTest({ ...test, isLive: isLive });
  // };

  // const updateVariantContributionAmounts = (variantIndex: number) => (
  //   contributionAmounts: ContributionAmounts,
  // ): void => {
  //   const updatedVariants = [
  //     ...test.variants.slice(0, variantIndex),
  //     { ...test.variants[variantIndex], amounts: contributionAmounts },
  //     ...test.variants.slice(variantIndex + 1),
  //   ];
  //   updateTest({
  //     ...test,
  //     variants: updatedVariants,
  //   });
  // };

  // const deleteVariant = (variantIndex: number) => (): void => {
  //   const updatedVariants = [
  //     ...test.variants.slice(0, variantIndex),
  //     ...test.variants.slice(variantIndex + 1),
  //   ];
  //   updateTest({
  //     ...test,
  //     variants: updatedVariants,
  //   });
  // };

  // const createVariant = (name: string): void => {
  //   const updatedVariants: AmountsTestVariant[] = [
  //     ...test.variants,
  //     variantWithDefaultAmounts(name),
  //   ];
  //   updateTest({
  //     ...test,
  //     variants: updatedVariants,
  //   });
  // };

  // const classes = useStyles();

  // return (
  //   <div className={classes.container}>
  //     <div className={classes.header}>
  //       <span>{test.name}</span>
  //       <AmountsTestEditorDeleteButton onDelete={deleteTest} />
  //     </div>

  //     <div>
  //       <LiveSwitch
  //         label="Live on support.theguardian.com"
  //         isLive={test.isLive}
  //         onChange={updateIsLive}
  //         isDisabled={false}
  //       />
  //     </div>

  //     {test.variants.length > 0
  //       ? test.variants.map((variant, index) => (
  //           <div className={classes.amountsEditorContainer} key={variant.name}>
  //             <AmountsEditor
  //               label={variant.name}
  //               contributionAmounts={variant.amounts}
  //               updateContributionAmounts={updateVariantContributionAmounts(index)}
  //               deleteContributionAmounts={deleteVariant(index)}
  //             />
  //           </div>
  //         ))
  //       : null}

  //     <div className={classes.createVariantButtonContainer}>
  //       <CreateVariantButton
  //         onCreate={createVariant}
  //         existingNames={test.variants.map(v => v.name)}
  //       />
  //     </div>
  //   </div>
  // );










// import React from 'react';

// import { makeStyles, Theme } from '@material-ui/core/styles';
// import AmountsEditor from './contributionAmountsEditor';
// import CreateVariantButton from './createVariantButton';

// import { AmountsTest, AmountsTestVariant, ContributionAmounts } from './configuredAmountsEditor';
// import AmountsTestEditorDeleteButton from './amountsTestEditorDeleteButton';
// import LiveSwitch from '../shared/liveSwitch';

// const useStyles = makeStyles(({ spacing }: Theme) => ({
//   container: {
//     marginTop: spacing(4),
//   },
//   header: {
//     display: 'flex',
//     flexDirection: 'row',
//     alignItems: 'center',
//     fontSize: 16,
//     textTransform: 'uppercase',
//     fontWeight: 'bold',

//     '& > * + *': {
//       marginLeft: spacing(2),
//     },
//   },
//   amountsEditorContainer: {
//     marginTop: spacing(2),
//   },
//   createVariantButtonContainer: {
//     marginTop: spacing(3),
//   },
// }));

// const variantWithDefaultAmounts = (name: string): AmountsTestVariant => ({
//   name: name,
//   amounts: {
//     ONE_OFF: {
//       amounts: [],
//       defaultAmount: 0,
//       hideChooseYourAmount: false,
//     },
//     MONTHLY: {
//       amounts: [],
//       defaultAmount: 0,
//       hideChooseYourAmount: false,
//     },
//     ANNUAL: {
//       amounts: [],
//       defaultAmount: 0,
//       hideChooseYourAmount: false,
//     },
//   },
// });

// interface AmountsTestEditorProps {
//   test: AmountsTest;
//   updateTest: (updatedTest: AmountsTest) => void;
//   deleteTest: () => void;
// }

// const AmountsTestEditor: React.FC<AmountsTestEditorProps> = ({
//   test,
//   updateTest,
//   deleteTest,
// }: AmountsTestEditorProps) => {
//   const updateIsLive = (isLive: boolean): void => {
//     updateTest({ ...test, isLive: isLive });
//   };

//   const updateVariantContributionAmounts = (variantIndex: number) => (
//     contributionAmounts: ContributionAmounts,
//   ): void => {
//     const updatedVariants = [
//       ...test.variants.slice(0, variantIndex),
//       { ...test.variants[variantIndex], amounts: contributionAmounts },
//       ...test.variants.slice(variantIndex + 1),
//     ];
//     updateTest({
//       ...test,
//       variants: updatedVariants,
//     });
//   };

//   const deleteVariant = (variantIndex: number) => (): void => {
//     const updatedVariants = [
//       ...test.variants.slice(0, variantIndex),
//       ...test.variants.slice(variantIndex + 1),
//     ];
//     updateTest({
//       ...test,
//       variants: updatedVariants,
//     });
//   };

//   const createVariant = (name: string): void => {
//     const updatedVariants: AmountsTestVariant[] = [
//       ...test.variants,
//       variantWithDefaultAmounts(name),
//     ];
//     updateTest({
//       ...test,
//       variants: updatedVariants,
//     });
//   };

//   const classes = useStyles();
//   return (
//     <div className={classes.container}>
//       <div className={classes.header}>
//         <span>{test.name}</span>
//         <AmountsTestEditorDeleteButton onDelete={deleteTest} />
//       </div>

//       <div>
//         <LiveSwitch
//           label="Live on support.theguardian.com"
//           isLive={test.isLive}
//           onChange={updateIsLive}
//           isDisabled={false}
//         />
//       </div>

//       {test.variants.length > 0
//         ? test.variants.map((variant, index) => (
//             <div className={classes.amountsEditorContainer} key={variant.name}>
//               <AmountsEditor
//                 label={variant.name}
//                 contributionAmounts={variant.amounts}
//                 updateContributionAmounts={updateVariantContributionAmounts(index)}
//                 deleteContributionAmounts={deleteVariant(index)}
//               />
//             </div>
//           ))
//         : null}

//       <div className={classes.createVariantButtonContainer}>
//         <CreateVariantButton
//           onCreate={createVariant}
//           existingNames={test.variants.map(v => v.name)}
//         />
//       </div>
//     </div>
//   );
// };

// export default AmountsTestEditor;
