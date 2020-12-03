import React from 'react';

import { makeStyles, Theme } from '@material-ui/core/styles';
import AmountsEditor from './contributionAmountsEditor';

import { ConfiguredRegionAmounts, ContributionAmounts } from './configuredAmountsEditor';

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
}));

interface ConfiguredRegionAmountsEditorProps {
  label: string;
  configuredRegionAmounts: ConfiguredRegionAmounts;
  updateConfiguredRegionAmounts: (configuredRegionAmounts: ConfiguredRegionAmounts) => void;
}

const ConfiguredRegionAmountsEditor: React.FC<ConfiguredRegionAmountsEditorProps> = ({
  label,
  configuredRegionAmounts,
  updateConfiguredRegionAmounts,
}: ConfiguredRegionAmountsEditorProps) => {
  const updateControl = (contributionAmounts: ContributionAmounts): void =>
    updateConfiguredRegionAmounts({ ...configuredRegionAmounts, control: contributionAmounts });

  const updateVariant = (variantIndex: number) => (
    contributionAmounts: ContributionAmounts,
  ): void => {
    if (!configuredRegionAmounts.test) {
      return;
    }

    const variants = configuredRegionAmounts.test.variants;
    const updatedVariants = [
      ...variants.slice(0, variantIndex),
      { ...variants[variantIndex], amounts: contributionAmounts },
      ...variants.slice(variantIndex + 1),
    ];

    updateConfiguredRegionAmounts({
      ...configuredRegionAmounts,
      test: { ...configuredRegionAmounts.test, variants: updatedVariants },
    });
  };

  const classes = useStyles();
  return (
    <div className={classes.container}>
      <div className={classes.header}>{label}</div>
      <div className={classes.amountsEditorContainer}>
        <AmountsEditor
          label="Control"
          updateContributionAmounts={updateControl}
          contributionAmounts={configuredRegionAmounts.control}
        />
      </div>
      {configuredRegionAmounts.test ? (
        <div className={classes.testContainer}>
          <div className={classes.testHeader}>{configuredRegionAmounts.test.name}</div>

          {configuredRegionAmounts.test.variants.length > 0
            ? configuredRegionAmounts.test.variants.map((variant, index) => (
                <div className={classes.amountsEditorContainer} key={variant.name}>
                  <AmountsEditor
                    label={variant.name}
                    updateContributionAmounts={updateVariant(index)}
                    contributionAmounts={variant.amounts}
                  />
                </div>
              ))
            : // no variants
              null}
        </div>
      ) : // no test
      null}
    </div>
  );
};

export default ConfiguredRegionAmountsEditor;
