import React, { useState, useEffect } from 'react';

import { Typography, Button,  } from '@material-ui/core';
import SaveIcon from '@material-ui/icons/Save';
import { makeStyles, Theme } from '@material-ui/core/styles';
import LiveSwitch from '../shared/liveSwitch';

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
  addVariantButton: {},
  deleteTestButton: {},
  saveButton: {},
  saveButtonText: {},
}));

  // const SaveButton: React.FC = () => (
  // );

interface AmountsTestEditorProps {
  test: AmountsTest | undefined;
  updateTest: (updatedTest: AmountsTest) => void;
  deleteTest: (test: AmountsTest) => void | undefined;
}

const AmountsTestEditor: React.FC<AmountsTestEditorProps> = ({
  test,
  updateTest,
  deleteTest,
}: AmountsTestEditorProps) => {
console.log('editor - test', test);
  const classes = useStyles();

  const testName = test?.testName;
  const isLive = test?.isLive || false;
  const target = test?.target;
  const seed = test?.seed;
  const variants = test?.variants;

  const [testIsLive, setTestIsLive] = useState<boolean>(isLive);
  const [testVariants, setTestVariants] = useState<AmountsVariant[]>([]);

  useEffect(() => {
    if (test != null && variants != null) {
      setTestVariants([...variants]);
    }
  }, [test]);

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
  }

  const deleteVariant = (variant: AmountsVariant) => {
    const deleteName = variant.variantName;
    const newState = testVariants.filter(v => deleteName !== v.variantName);
    setTestVariants(newState);
  };

  const updateTestIsLive = () => {
    const newState = !testIsLive;
    setTestIsLive(newState);
    test.isLive = newState;
  };

  const saveCurrentTest = () => {
    if (testName != null && target != null && seed != null) {
      updateTest({
         testName, 
         isLive: testIsLive,
         target, 
         seed, 
         variants: testVariants,
       });
    }
  };

  const deleteCurrentTest = () => {
    if (testName != null && target != null && seed != null) {
      deleteTest({
         testName, 
         isLive: testIsLive,
         target, 
         seed, 
         variants: testVariants,
       });
    }
  };

  const addVariantForm = (variant: AmountsVariant) => {
  };

  return (
    <div className={classes.container}>
      <div className={classes.formHead}>
        <div>
          <Typography>Test name: {testName}</Typography>
          <Typography>Target: {target}</Typography>
          <Typography>Seed: {seed}</Typography>
          <LiveSwitch
            label="Control vs variants A/B test is live"
            isLive={testIsLive}
            onChange={updateTestIsLive}
            isDisabled={false}
          />
        </div>
        <div>
          <Button
            variant="contained"
            color="primary"
            className={classes.saveButton}
            startIcon={<SaveIcon />}
          >
            <Typography className={classes.saveButtonText}>Save</Typography>
          </Button>
        </div>
      </div>
       <div className={classes.formBody}>
         {testVariants.map(v => addVariantForm(v))}
      </div>
   </div>
  );
};

export default AmountsTestEditor;

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
