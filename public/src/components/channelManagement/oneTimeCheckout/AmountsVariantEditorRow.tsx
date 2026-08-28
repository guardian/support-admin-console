import { FormControl, InputLabel, MenuItem, Select, Theme } from '@mui/material';
import { makeStyles } from '@mui/styles';
import React from 'react';
import { ContributionType, MParticleAmountAttribute } from '../../../utils/models';
import LiveSwitch from '../../shared/liveSwitch';
import { AmountsVariantEditorRowAmount } from './AmountsVariantEditorRowAmount';
import { AmountsVariantEditorRowInput } from './AmountsVariantEditorRowInput';

const useStyles = makeStyles(({ spacing, palette }: Theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  amountsLabelContainer: {
    width: '100%',
    display: 'flex',
    justifyContent: 'flex-start',
    marginTop: spacing(1),
    marginBottom: spacing(1),
  },
  mParticleAmountContainer: {
    width: '100%',
    maxWidth: 400,
    alignSelf: 'flex-start',
    marginTop: spacing(2),
  },
  otherAmountSwitchContainer: {
    width: '100%',
    display: 'flex',
    justifyContent: 'flex-start',
    marginTop: spacing(1),
  },
  amountsLabel: {
    width: 80,
    textTransform: 'uppercase',
    fontWeight: 'bold',
    color: palette.grey[800],
  },
  amountsAndInputContainer: {
    flexGrow: 1,
    display: 'flex',
    justifyContent: 'space-between',
    width: '100%',

    '& > * + *': {
      marginLeft: spacing(4),
    },
  },
  amountsContainer: {
    display: 'flex',
    flexDirection: 'row',
    margin: 0,

    '& > * + *': {
      marginLeft: spacing(2),
    },
  },
}));

interface AmountsVariantEditorRowProps {
  label: ContributionType;
  amounts: number[];
  defaultAmount: number;
  hideChooseYourAmount: boolean;
  mParticleAmountAttribute?: MParticleAmountAttribute;
  updateAmounts: (label: ContributionType, val: number[]) => void;
  updateChooseAmount: (label: ContributionType, val: boolean) => void;
  updateDefaultAmount: (label: ContributionType, val: number) => void;
  updateMParticleAmountAttribute: (label: ContributionType, val?: MParticleAmountAttribute) => void;
  disabled?: boolean;
}

export const AmountsVariantEditorRow: React.FC<AmountsVariantEditorRowProps> = ({
  label,
  amounts,
  defaultAmount,
  hideChooseYourAmount,
  mParticleAmountAttribute,
  updateAmounts,
  updateChooseAmount,
  updateDefaultAmount,
  updateMParticleAmountAttribute,
  disabled = false,
}: AmountsVariantEditorRowProps) => {
  const classes = useStyles();

  const setAmountAsDefault = (val: number) => {
    updateDefaultAmount(label, val);
  };

  const addAmount = (val: number) => {
    const update: number[] = [];
    update.push(...amounts, val);
    update.sort((a, b) => a - b);
    updateAmounts(label, update);
  };

  const deleteAmount = (val: number) => {
    const update = amounts.filter((a) => a !== val);
    updateAmounts(label, update);
  };

  const updateChooseSwitch = (val: boolean) => {
    updateChooseAmount(label, val);
  };

  const updateMParticleAmount = (value: MParticleAmountAttribute | '') => {
    updateMParticleAmountAttribute(label, value || undefined);
  };

  return (
    <div className={classes.container}>
      <div className={classes.amountsLabelContainer}>
        <div className={classes.amountsLabel}>{label}</div>
      </div>
      <div className={classes.amountsAndInputContainer}>
        <div className={classes.amountsContainer}>
          {amounts.map((amount) => (
            <AmountsVariantEditorRowAmount
              key={`${label}_${amount}`}
              amount={amount}
              isDefault={amount === defaultAmount}
              setAsDefault={() => setAmountAsDefault(amount)}
              deleteAmount={() => deleteAmount(amount)}
              disabled={disabled}
            />
          ))}
        </div>
        <AmountsVariantEditorRowInput amounts={amounts} addAmount={addAmount} disabled={disabled} />
      </div>
      <div className={classes.otherAmountSwitchContainer}>
        <LiveSwitch
          label="Include CHOOSE button"
          isLive={!hideChooseYourAmount}
          onChange={() => updateChooseSwitch(!hideChooseYourAmount)}
          isDisabled={disabled}
        />
      </div>
      <div className={classes.mParticleAmountContainer}>
        <FormControl fullWidth size="small" disabled={disabled}>
          <InputLabel id={`${label}-mParticleAmountAttribute-label`} shrink>
            mParticle amount attribute
          </InputLabel>
          <Select
            labelId={`${label}-mParticleAmountAttribute-label`}
            value={mParticleAmountAttribute ?? ''}
            label="mParticle amount attribute"
            displayEmpty
            renderValue={() => (mParticleAmountAttribute ? 'Last contribution amount' : 'None')}
            onChange={(event) =>
              updateMParticleAmount(event.target.value as MParticleAmountAttribute | '')
            }
          >
            <MenuItem value="">None</MenuItem>
            <MenuItem value="last_contribution_amount">Last contribution amount</MenuItem>
          </Select>
        </FormControl>
      </div>
    </div>
  );
};
