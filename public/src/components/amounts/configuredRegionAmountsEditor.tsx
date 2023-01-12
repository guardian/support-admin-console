import React from 'react';

import { makeStyles, Theme } from '@material-ui/core/styles';
import AmountsEditor from './contributionAmountsEditor';
import AmountsTestEditor from './amountsTestEditor';
import CreateTestButton from './createTestButton';

import {
  AmountsTest,
  ConfiguredRegionAmounts,
  ContributionAmounts,
} from './configuredAmountsEditor';

const useStyles = makeStyles(({ spacing }: Theme) => ({
  container: {
    paddingTop: spacing(6),
    paddingLeft: spacing(6),

    '& > * + *': {
      marginTop: spacing(2),
    },

    '& > :last-child': {
      paddingBottom: spacing(6),
    },
  },
  header: {
    fontSize: 32,
    textTransform: 'uppercase',
  },
  amountsEditorContainer: {
    marginTop: spacing(2),
  },
  testContainer: {
    marginTop: spacing(4),
  },
  testHeader: {
    fontSize: 16,
    textTransform: 'uppercase',
    fontWeight: 'bold',
  },
  createVariantButtonContainer: {
    marginTop: spacing(3),
  },
}));

const generateRandomSeed = (): number => {
  const MAX_SEED = 1_000_000;

  return Math.floor(Math.random() * MAX_SEED);
};

interface ConfiguredRegionAmountsEditorProps {
  label: string;
  configuredRegionAmounts: ConfiguredRegionAmounts;
  hideChooseYourAmount: boolean;
  updateChooseYourAmountButton: (hideChooseYourAmount: boolean) => void;
  updateConfiguredRegionAmounts: (configuredRegionAmounts: ConfiguredRegionAmounts) => void;
  existingTestNames: string[];
}

const ConfiguredRegionAmountsEditor: React.FC<ConfiguredRegionAmountsEditorProps> = ({
  label,
  configuredRegionAmounts,
  hideChooseYourAmount,
  updateChooseYourAmountButton,
  updateConfiguredRegionAmounts,
  existingTestNames,
}: ConfiguredRegionAmountsEditorProps) => {
  const updateControlAmounts = (contributionAmounts: ContributionAmounts): void =>
    updateConfiguredRegionAmounts({ ...configuredRegionAmounts, control: contributionAmounts });

  const updateTest = (updatedTest: AmountsTest): void =>
    updateConfiguredRegionAmounts({ ...configuredRegionAmounts, test: updatedTest });

  const deleteTest = (): void =>
    updateConfiguredRegionAmounts({ ...configuredRegionAmounts, test: undefined });

  const createTest = (name: string): void =>
    updateConfiguredRegionAmounts({
      ...configuredRegionAmounts,
      test: { name, isLive: false, variants: [], seed: generateRandomSeed() },
    });

  const classes = useStyles();
  return (
    <div className={classes.container}>
      <div className={classes.header}>{label}</div>
      <div className={classes.amountsEditorContainer}>
        <AmountsEditor
          label="Control"
          hideChooseYourAmount={hideChooseYourAmount}
          updateChooseYourAmountButton={() => updateChooseYourAmountButton(!hideChooseYourAmount)}
          updateContributionAmounts={updateControlAmounts}
          contributionAmounts={configuredRegionAmounts.control}
        />
      </div>
      {configuredRegionAmounts.test ? (
        <AmountsTestEditor
          test={configuredRegionAmounts.test}
          updateTest={updateTest}
          deleteTest={deleteTest}
        />
      ) : (
        <div>
          <CreateTestButton onCreate={createTest} existingNames={existingTestNames} />
        </div>
      )}
    </div>
  );
};

export default ConfiguredRegionAmountsEditor;
