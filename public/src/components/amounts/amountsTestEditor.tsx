import React from 'react';

import { makeStyles, Theme } from '@material-ui/core/styles';
import AmountsEditor from './contributionAmountsEditor';
import CreateVariantButton from './createVariantButton';

import { AmountsTest, AmountsTestVariant, ContributionAmounts } from './configuredAmountsEditor';
import AmountsTestEditorDeleteButton from './amountsTestEditorDeleteButton';
import LiveSwitch from '../shared/liveSwitch';

const useStyles = makeStyles(({ spacing }: Theme) => ({
  container: {
    marginTop: spacing(4),
  },
  header: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    fontSize: 16,
    textTransform: 'uppercase',
    fontWeight: 'bold',

    '& > * + *': {
      marginLeft: spacing(2),
    },
  },
  amountsEditorContainer: {
    marginTop: spacing(2),
  },
  createVariantButtonContainer: {
    marginTop: spacing(3),
  },
}));

const variantWithDefaultAmounts = (name: string): AmountsTestVariant => ({
  name: name,
  amounts: {
    ONE_OFF: {
      amounts: [],
      defaultAmount: 0,
    },
    MONTHLY: {
      amounts: [],
      defaultAmount: 0,
    },
    ANNUAL: {
      amounts: [],
      defaultAmount: 0,
    },
  },
});

interface AmountsTestEditorProps {
  test: AmountsTest;
  updateTest: (updatedTest: AmountsTest) => void;
  deleteTest: () => void;
}

const AmountsTestEditor: React.FC<AmountsTestEditorProps> = ({
  test,
  updateTest,
  deleteTest,
}: AmountsTestEditorProps) => {
  const updateIsLive = (isLive: boolean): void => {
    updateTest({ ...test, isLive: isLive });
  };

  const updateVariant = (variantIndex: number) => (
    contributionAmounts: ContributionAmounts,
  ): void => {
    const updatedVariants = [
      ...test.variants.slice(0, variantIndex),
      { ...test.variants[variantIndex], amounts: contributionAmounts },
      ...test.variants.slice(variantIndex + 1),
    ];
    updateTest({
      ...test,
      variants: updatedVariants,
    });
  };

  const deleteVariant = (variantIndex: number) => (): void => {
    const updatedVariants = [
      ...test.variants.slice(0, variantIndex),
      ...test.variants.slice(variantIndex + 1),
    ];
    updateTest({
      ...test,
      variants: updatedVariants,
    });
  };

  const createVariant = (name: string): void => {
    const updatedVariants: AmountsTestVariant[] = [
      ...test.variants,
      variantWithDefaultAmounts(name),
    ];
    updateTest({
      ...test,
      variants: updatedVariants,
    });
  };

  const classes = useStyles();
  return (
    <div className={classes.container}>
      <div className={classes.header}>
        <span>{test.name}</span>
        <AmountsTestEditorDeleteButton onDelete={deleteTest} />
      </div>

      <div>
        <LiveSwitch
          label="Live on support.theguardian.com"
          isLive={test.isLive}
          onChange={updateIsLive}
        />
      </div>

      {test.variants.length > 0
        ? test.variants.map((variant, index) => (
            <div className={classes.amountsEditorContainer} key={variant.name}>
              <AmountsEditor
                label={variant.name}
                updateContributionAmounts={updateVariant(index)}
                deleteContributionAmounts={deleteVariant(index)}
                contributionAmounts={variant.amounts}
              />
            </div>
          ))
        : null}

      <div className={classes.createVariantButtonContainer}>
        <CreateVariantButton
          onCreate={createVariant}
          existingNames={test.variants.map(v => v.name)}
        />
      </div>
    </div>
  );
};

export default AmountsTestEditor;
