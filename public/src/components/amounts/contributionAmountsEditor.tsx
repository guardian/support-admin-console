import React from 'react';
import { makeStyles, Theme } from '@material-ui/core';
import { AmountSelection, ContributionAmounts } from './configuredAmountsEditor';
import AmountEditorRow from './amountsEditorRow';

const useStyles = makeStyles(({ spacing, palette }: Theme) => ({
  container: {
    padding: `${spacing(3)}px ${spacing(4)}px`,
    border: `1px solid ${palette.grey[700]}`,
    borderRadius: 4,
    background: 'white',

    '& > * + *': {
      marginTop: spacing(2),
    },
  },
  header: {
    color: palette.grey[800],
    fontSize: 18,
    fontWeight: 'bold',
  },
  rowsContainer: {
    '& > * + *': {
      marginTop: spacing(2),
    },
  },
}));

interface AmountsEditorProps {
  label: string;
  contributionAmounts: ContributionAmounts;
  updateContributionAmounts: (contributionAmounts: ContributionAmounts) => void;
}

const AmountsEditor: React.FC<AmountsEditorProps> = ({
  label,
  contributionAmounts,
  updateContributionAmounts,
}: AmountsEditorProps) => {
  const classes = useStyles();

  return (
    <div className={classes.container}>
      <div className={classes.header}>{label}</div>
      <div className={classes.rowsContainer}>
        <AmountEditorRow
          label="One off"
          amountsSelection={contributionAmounts.ONE_OFF}
          updateSelection={(amountSelection: AmountSelection): void =>
            updateContributionAmounts({ ...contributionAmounts, ONE_OFF: amountSelection })
          }
        />
        <AmountEditorRow
          label="Monthly"
          amountsSelection={contributionAmounts.MONTHLY}
          updateSelection={(amountSelection: AmountSelection): void =>
            updateContributionAmounts({ ...contributionAmounts, MONTHLY: amountSelection })
          }
        />
        <AmountEditorRow
          label="Annual"
          amountsSelection={contributionAmounts.ANNUAL}
          updateSelection={(amountSelection: AmountSelection): void =>
            updateContributionAmounts({ ...contributionAmounts, ANNUAL: amountSelection })
          }
        />
      </div>
    </div>
  );
};

export default AmountsEditor;
