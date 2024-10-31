import React from 'react';
import { Methodology } from './helpers/shared';
import { makeStyles } from '@mui/styles';
import { MenuItem, Select, SelectChangeEvent, TextField, Theme } from '@mui/material';

const useStyles = makeStyles(({ spacing, palette }: Theme) => ({
  container: {
    '& > * + *': {
      marginTop: spacing(1),
    },
  },
  methodologyContainer: {
    display: 'flex',
    flexDirection: 'row',
    border: `1px solid ${palette.grey[800]}`,
    borderRadius: '4px',
    padding: spacing(1),
    '& > * + *': {
      marginLeft: spacing(1),
    },
  },
}));

const defaultEpsilonGreedyBandit: Methodology = {
  name: 'EpsilonGreedyBandit',
  epsilon: 0.1,
};

interface TestMethodologyProps {
  methodology: Methodology;
  isDisabled: boolean;
  onChange: (methodology: Methodology) => void;
}

const TestMethodology: React.FC<TestMethodologyProps> = ({
  methodology,
  isDisabled,
  onChange,
}: TestMethodologyProps) => {
  const classes = useStyles();

  const onSelectChange = (event: SelectChangeEvent<Methodology['name']>) => {
    const value = event.target.value as Methodology['name'];
    if (value === 'EpsilonGreedyBandit') {
      onChange(defaultEpsilonGreedyBandit);
    } else {
      onChange({ name: 'ABTest' });
    }
  };
  return (
    <div className={classes.methodologyContainer}>
      <div>
        <Select value={methodology.name} onChange={onSelectChange}>
          <MenuItem value={'ABTest'} key={'ABTest'}>
            AB test
          </MenuItem>
          <MenuItem value={'EpsilonGreedyBandit'} key={'EpsilonGreedyBandit'}>
            Epsilon-greedy bandit
          </MenuItem>
        </Select>
      </div>
      <div>
        {methodology.name === 'EpsilonGreedyBandit' && (
          <div>
            <TextField
              type={'number'}
              InputProps={{ inputProps: { min: 0.1, max: 1, step: 0.1 } }}
              value={methodology.epsilon}
              label={'Epsilon'}
              disabled={isDisabled}
              onChange={event => {
                const epsilon = parseFloat(event.target.value);
                onChange({ ...methodology, epsilon });
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

interface TestMethodologyEditorProps {
  methodologies: Methodology[];
  onChange: (methodologies: Methodology[]) => void;
  isDisabled: boolean;
}

export const TestMethodologyEditor: React.FC<TestMethodologyEditorProps> = ({
  methodologies,
  onChange,
  isDisabled,
}: TestMethodologyEditorProps) => {
  const classes = useStyles();

  // For now we only support one methodology
  const methodology = methodologies[0] ?? { name: 'ABTest' };

  return (
    <div className={classes.container}>
      <TestMethodology
        methodology={methodology}
        isDisabled={isDisabled}
        onChange={updatedMethodology => {
          onChange([updatedMethodology]);
        }}
      />
    </div>
  );
};
