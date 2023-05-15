import React, { useState, useEffect } from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';
import {
  Checkbox,
  Divider,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  Radio,
  RadioGroup,
} from '@material-ui/core';
import { AmountsVariantEditorRow } from './AmountsVariantEditorRow';
import { DeleteVariantButton } from './DeleteVariantButton';

import {
  AmountsVariant,
  ContributionType,
  ContributionTypes,
  AmountValuesObject,
} from '../../utils/models';

const useStyles = makeStyles(({ spacing, palette }: Theme) => ({
  container: {
    padding: `${spacing(3)}px ${spacing(4)}px`,
    border: `1px solid ${palette.grey[700]}`,
    borderRadius: 4,
    backgroundColor: 'white',
    marginTop: spacing(2),

    '& > * + *': {
      marginTop: spacing(2),
    },
  },
  topBar: {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
  },
  variantName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  contributionControls: {
    display: 'block',
  },
}));

interface AmountsVariantEditorProps {
  variant: AmountsVariant;
  updateVariant: (variant: AmountsVariant) => void;
  deleteVariant: (variant: AmountsVariant) => void;
}

export const AmountsVariantEditor: React.FC<AmountsVariantEditorProps> = ({
  variant,
  updateVariant,
  deleteVariant,
}: AmountsVariantEditorProps) => {
  const classes = useStyles();

  const {
    amountsCardData,
    defaultContributionType,
    displayContributionType,
    variantName,
  } = variant;

  const [currentContributionDefault, setCurrentContributionDefault] = useState(
    defaultContributionType,
  );

  const [currentContributionDisplay, setCurrentContributionDisplay] = useState(
    displayContributionType,
  );

  useEffect(() => {
    setCurrentContributionDefault(defaultContributionType);
    setCurrentContributionDisplay(displayContributionType);
  }, [variant]);

  useEffect(() => {
    const updatedAmounts: AmountsVariant = {
      variantName,
      defaultContributionType: currentContributionDefault,
      displayContributionType: currentContributionDisplay,
      amountsCardData,
    };
    updateVariant(updatedAmounts);
  }, [currentContributionDefault, currentContributionDisplay]);

  const updateAmounts = (label: ContributionType, val: number[]) => {
    const contributionsToUpdate = amountsCardData[label];
    if (contributionsToUpdate != null) {
      const updatedAmounts: AmountsVariant = {
        variantName,
        defaultContributionType,
        displayContributionType,
        amountsCardData: {
          ...amountsCardData,
          [label]: {
            ...contributionsToUpdate,
            amounts: val,
          },
        },
      };
      updateVariant(updatedAmounts);
    }
  };

  const updateChooseAmount = (label: ContributionType, val: boolean) => {
    const contributionsToUpdate = amountsCardData[label];
    if (contributionsToUpdate != null) {
      const updatedAmounts: AmountsVariant = {
        variantName,
        defaultContributionType,
        displayContributionType,
        amountsCardData: {
          ...amountsCardData,
          [label]: {
            ...contributionsToUpdate,
            hideChooseYourAmount: val,
          },
        },
      };
      updateVariant(updatedAmounts);
    }
  };

  const updateDefaultAmount = (label: ContributionType, val: number) => {
    const contributionsToUpdate = amountsCardData[label];
    if (contributionsToUpdate != null) {
      const updatedAmounts: AmountsVariant = {
        variantName,
        defaultContributionType,
        displayContributionType,
        amountsCardData: {
          ...amountsCardData,
          [label]: {
            ...contributionsToUpdate,
            defaultAmount: val,
          },
        },
      };
      updateVariant(updatedAmounts);
    }
  };

  const updateDefaultContribution = (event: React.ChangeEvent<HTMLInputElement>) => {
    const updatedDefault = (event.target as HTMLInputElement).value as ContributionType;
    setCurrentContributionDefault(updatedDefault);
  };

  const updateDisplayContribution = (event: React.ChangeEvent<HTMLInputElement>) => {
    const updatedContribution = event.target.name as ContributionType;
    const includeContribution = event.target.checked;
    const updatedDisplayContribution: ContributionType[] = [];

    if (includeContribution) {
      if (!currentContributionDisplay.includes(updatedContribution)) {
        updatedDisplayContribution.push(...currentContributionDisplay, updatedContribution);
      }
    } else {
      const filteredContributions = currentContributionDisplay.filter(c => {
        return c !== updatedContribution;
      });
      updatedDisplayContribution.push(...filteredContributions);
    }
    setCurrentContributionDisplay(updatedDisplayContribution);
  };

  const confirmDeletion = () => deleteVariant(variant);

  const buildAmountsCardRows = () => {
    return (
      <div>
        {Object.keys(ContributionTypes).map(k => {
          const cardData: AmountValuesObject = amountsCardData[k as ContributionType];
          if (cardData != null) {
            return (
              <div key={`${variantName}_${k}_row`}>
                <Divider />
                <AmountsVariantEditorRow
                  label={k as ContributionType}
                  amounts={cardData.amounts}
                  defaultAmount={cardData.defaultAmount}
                  hideChooseYourAmount={cardData.hideChooseYourAmount}
                  updateAmounts={updateAmounts}
                  updateChooseAmount={updateChooseAmount}
                  updateDefaultAmount={updateDefaultAmount}
                />
              </div>
            );
          } else {
            return <></>;
          }
        })}
      </div>
    );
  };

  const buildDefaultContributionControl = () => {
    return (
      <FormControl className={classes.contributionControls}>
        <FormLabel id={`${variantName}_default_contribution_selector`}>
          Default contributions type
        </FormLabel>
        <RadioGroup
          aria-labelledby={`${variantName}_default_contribution_selector`}
          name={`${variantName}_default_contribution_selector`}
          value={currentContributionDefault}
          onChange={e => updateDefaultContribution(e)}
          row
        >
          {Object.keys(ContributionTypes).map(k => {
            return (
              <FormControlLabel
                key={`${variantName}_${k}`}
                value={k}
                control={<Radio />}
                label={k}
                disabled={!currentContributionDisplay.includes(k as ContributionType)}
              />
            );
          })}
        </RadioGroup>
      </FormControl>
    );
  };

  const buildDisplayContributionControl = () => {
    return (
      <FormControl
        required
        component="fieldset"
        variant="standard"
        className={classes.contributionControls}
      >
        <FormLabel id={`${variantName}_display_contribution_selector`}>
          Display contributions type
        </FormLabel>
        <FormGroup row>
          {Object.keys(ContributionTypes).map(k => {
            return (
              <FormControlLabel
                key={`${variantName}_${k}`}
                control={
                  <Checkbox
                    checked={currentContributionDisplay.includes(k as ContributionType)}
                    onChange={e => updateDisplayContribution(e)}
                    name={k}
                  />
                }
                label={k}
              />
            );
          })}
        </FormGroup>
      </FormControl>
    );
  };

  const checkIfVariantIsControl = () => {
    return 'CONTROL' === variantName.toUpperCase();
  };

  return (
    <div className={classes.container}>
      <div className={classes.topBar}>
        <div className={classes.variantName}>{variantName}</div>
        {!checkIfVariantIsControl() && (
          <DeleteVariantButton variantName={variantName} confirmDeletion={confirmDeletion} />
        )}
      </div>
      {buildDisplayContributionControl()}
      {buildDefaultContributionControl()}
      {buildAmountsCardRows()}
    </div>
  );
};
