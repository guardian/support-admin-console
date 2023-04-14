// import React from 'react';
// import { makeStyles, Theme } from '@material-ui/core';
// import { AmountSelection, ContributionAmounts } from './configuredAmountsEditor';
// import AmountEditorRow from './amountsEditorRow';
// import AmountEditorDeleteButton from './contributionAmountsEditorDeleteButton';
// import { ContributionType } from '../../utils/models';

// const useStyles = makeStyles(({ spacing, palette }: Theme) => ({
//   container: {
//     padding: `${spacing(3)}px ${spacing(4)}px`,
//     border: `1px solid ${palette.grey[700]}`,
//     borderRadius: 4,
//     backgroundColor: 'white',

//     '& > * + *': {
//       marginTop: spacing(2),
//     },
//   },
//   header: {
//     display: 'flex',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     color: palette.grey[800],
//     fontSize: 18,
//     fontWeight: 'bold',
//   },
//   rowsContainer: {
//     '& > * + *': {
//       marginTop: spacing(2),
//     },
//   },
// }));

// interface AmountsEditorProps {
//   label: string;
//   contributionAmounts: ContributionAmounts;
//   updateContributionAmounts: (contributionAmounts: ContributionAmounts) => void;
//   deleteContributionAmounts?: () => void;
// }

// const AmountsEditor: React.FC<AmountsEditorProps> = ({
//   label,
//   contributionAmounts,
//   updateContributionAmounts,
//   deleteContributionAmounts,
// }: AmountsEditorProps) => {
//   const classes = useStyles();

//   const handleAmountSelection = (product: ContributionType, change: AmountSelection) => {
//     updateContributionAmounts({
//       ...contributionAmounts,
//       [product]: change,
//     });
//   };

//   const handleOtherButtonChange = (product: ContributionType, change: boolean) => {
//     updateContributionAmounts({
//       ...contributionAmounts,
//       [product]: {
//         ...contributionAmounts[product],
//         hideChooseYourAmount: change,
//       },
//     });
//   };

//   const getOtherButtonValue = (product: ContributionType) => {
//     return contributionAmounts[product].hideChooseYourAmount ?? false;
//   };

//   return (
//     <div className={classes.container}>
//       <div className={classes.header}>
//         {label}
//         {deleteContributionAmounts && (
//           <AmountEditorDeleteButton onDelete={deleteContributionAmounts} />
//         )}
//       </div>
//       <div className={classes.rowsContainer}>
//         <AmountEditorRow
//           label="One off"
//           amountsSelection={contributionAmounts.ONE_OFF}
//           updateSelection={amount => handleAmountSelection(ContributionType.ONE_OFF, amount)}
//           hideChooseYourAmount={getOtherButtonValue(ContributionType.ONE_OFF)}
//           updateChooseYourAmountButton={value =>
//             handleOtherButtonChange(ContributionType.ONE_OFF, value)
//           }
//         />
//         <AmountEditorRow
//           label="Monthly"
//           amountsSelection={contributionAmounts.MONTHLY}
//           updateSelection={amount => handleAmountSelection(ContributionType.MONTHLY, amount)}
//           hideChooseYourAmount={getOtherButtonValue(ContributionType.MONTHLY)}
//           updateChooseYourAmountButton={value =>
//             handleOtherButtonChange(ContributionType.MONTHLY, value)
//           }
//         />
//         <AmountEditorRow
//           label="Annual"
//           amountsSelection={contributionAmounts.ANNUAL}
//           updateSelection={amount => handleAmountSelection(ContributionType.ANNUAL, amount)}
//           hideChooseYourAmount={getOtherButtonValue(ContributionType.ANNUAL)}
//           updateChooseYourAmountButton={value =>
//             handleOtherButtonChange(ContributionType.ANNUAL, value)
//           }
//         />
//       </div>
//     </div>
//   );
// };

// export default AmountsEditor;
