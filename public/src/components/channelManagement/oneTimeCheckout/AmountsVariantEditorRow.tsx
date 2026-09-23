import { Box, FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { styled } from '@mui/material/styles';
import React from 'react';
import { ContributionType, MParticleAmountAttribute } from '../../../utils/models';
import LiveSwitch from '../../shared/liveSwitch';
import { AmountsVariantEditorRowAmount } from './AmountsVariantEditorRowAmount';
import { AmountsVariantEditorRowInput } from './AmountsVariantEditorRowInput';

const Container = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
});

const AmountsLabelContainer = styled(Box)(({ theme }) => ({
  width: '100%',
  display: 'flex',
  justifyContent: 'flex-start',
  marginTop: theme.spacing(1),
  marginBottom: theme.spacing(1),
}));

const MParticleAmountContainer = styled(Box)(({ theme }) => ({
  width: '100%',
  maxWidth: 400,
  alignSelf: 'flex-start',
  marginTop: theme.spacing(2),
}));

const OtherAmountSwitchContainer = styled(Box)(({ theme }) => ({
  width: '100%',
  display: 'flex',
  justifyContent: 'flex-start',
  marginTop: theme.spacing(1),
}));

const AmountsLabel = styled(Box)(({ theme }) => ({
  width: 80,
  textTransform: 'uppercase',
  fontWeight: 'bold',
  color: theme.palette.grey[800],
}));

const AmountsAndInputContainer = styled(Box)(({ theme }) => ({
  flexGrow: 1,
  display: 'flex',
  justifyContent: 'space-between',
  width: '100%',

  '& > * + *': {
    marginLeft: theme.spacing(4),
  },
}));

const AmountsContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  margin: 0,

  '& > * + *': {
    marginLeft: theme.spacing(2),
  },
}));

interface AmountsVariantEditorRowProps {
  label: ContributionType;
  amounts: number[];
  defaultAmount: number;
  hideChooseYourAmount: boolean;
  mParticleAmountAttribute?: MParticleAmountAttribute;
  showMParticleMenu: boolean;
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
  showMParticleMenu,
  updateAmounts,
  updateChooseAmount,
  updateDefaultAmount,
  updateMParticleAmountAttribute,
  disabled = false,
}: AmountsVariantEditorRowProps) => {
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
    <Container>
      <AmountsLabelContainer>
        <AmountsLabel>{label}</AmountsLabel>
      </AmountsLabelContainer>
      <AmountsAndInputContainer>
        <AmountsContainer>
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
        </AmountsContainer>
        <AmountsVariantEditorRowInput amounts={amounts} addAmount={addAmount} disabled={disabled} />
      </AmountsAndInputContainer>
      <OtherAmountSwitchContainer>
        <LiveSwitch
          label="Include CHOOSE button"
          isLive={!hideChooseYourAmount}
          onChange={() => updateChooseSwitch(!hideChooseYourAmount)}
          isDisabled={disabled}
        />
      </OtherAmountSwitchContainer>
      {showMParticleMenu && (
        <MParticleAmountContainer>
          <FormControl fullWidth size="small" disabled={disabled}>
            <InputLabel id={`${label}-mParticleAmountAttribute-label`} shrink>
              mParticle amount attribute
            </InputLabel>
            <Select
              labelId={`${label}-mParticleAmountAttribute-label`}
              value={mParticleAmountAttribute ?? ''}
              label="mParticle amount attribute"
              displayEmpty
              renderValue={() =>
                mParticleAmountAttribute ? 'Last single contribution amount' : 'None'
              }
              onChange={(event) =>
                updateMParticleAmount(event.target.value as MParticleAmountAttribute | '')
              }
            >
              <MenuItem value="">None</MenuItem>
              <MenuItem value="last_single_contribution_amount">
                Last single contribution amount
              </MenuItem>
            </Select>
          </FormControl>
        </MParticleAmountContainer>
      )}
    </Container>
  );
};
