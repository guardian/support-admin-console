import {
  Alert,
  MenuItem,
  Select,
  SelectChangeEvent,
  Switch,
  TextField,
  Theme,
  Tooltip,
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import React from 'react';
import { BanditAnalyticsButton } from './BanditAnalyticsButton';
import { BanditMethodology, Methodology } from './helpers/shared';

const isBandit = (methodology: Methodology): methodology is BanditMethodology =>
  methodology.name === 'EpsilonGreedyBandit' || methodology.name === 'Roulette';

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
      marginLeft: spacing(2),
      paddingLeft: spacing(2),
      borderLeft: `1px solid ${palette.grey[400]}`,
    },
  },
  sampleCountContainer: {
    display: 'flex',
    alignItems: 'center',
    fontSize: '14px',
    fontWeight: 500,
  },
  sampleCountInput: {
    maxWidth: '90px',
    marginLeft: spacing(1),
  },
}));

const defaultEpsilonGreedyBandit: Methodology = {
  name: 'EpsilonGreedyBandit',
  epsilon: 0.1,
};

interface MethodologySampleCountProps {
  sampleCount?: number;
  onChange: (sampleCount?: number) => void;
  isDisabled: boolean;
}

const MethodologySampleCount: React.FC<MethodologySampleCountProps> = ({
  sampleCount,
  onChange,
  isDisabled,
}: MethodologySampleCountProps) => {
  const classes = useStyles();

  const onSwitchChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    if (event.target.checked) {
      onChange(24);
    } else {
      onChange(undefined);
    }
  };

  return (
    <div className={classes.sampleCountContainer}>
      <Tooltip
        title={
          'Only look back this many hours. If disabled, uses all data since the start of the test.'
        }
      >
        <div>
          <div>Window</div>
          <Switch checked={!!sampleCount} onChange={onSwitchChange} disabled={isDisabled} />
        </div>
      </Tooltip>
      <TextField
        className={classes.sampleCountInput}
        type={'number'}
        InputProps={{ inputProps: { min: 6, step: 1 } }}
        value={sampleCount}
        label={'Hours'}
        disabled={isDisabled || !sampleCount}
        InputLabelProps={{ shrink: true }}
        onChange={(event) => {
          const samples = parseInt(event.target.value);
          onChange(samples);
        }}
      />
    </div>
  );
};

interface SingleMethodologyEditorProps {
  methodology: Methodology;
  testName: string;
  channel: string;
  onChange: (methodology: Methodology) => void;
  isDisabled: boolean;
}

export const SingleMethodologyEditor: React.FC<SingleMethodologyEditorProps> = ({
  methodology,
  testName,
  channel,
  onChange,
  isDisabled,
}: SingleMethodologyEditorProps) => {
  const classes = useStyles();

  const onSelectChange = (event: SelectChangeEvent<Methodology['name']>) => {
    const value = event.target.value as Methodology['name'];
    if (value === 'EpsilonGreedyBandit') {
      onChange(defaultEpsilonGreedyBandit);
    } else if (value === 'Roulette') {
      onChange({ name: 'Roulette' });
    } else {
      onChange({ name: 'ABTest' });
    }
  };

  return (
    <div className={classes.container}>
      <Alert severity="info">Methodologies cannot be changed after a test has been launched</Alert>

      <div className={classes.methodologyContainer}>
        <div>
          <Select
            value={methodology.name}
            disabled={isDisabled}
            onChange={onSelectChange}
            name="methodology-select"
          >
            <MenuItem value={'ABTest'} key={'ABTest'}>
              AB test
            </MenuItem>
            <MenuItem value={'EpsilonGreedyBandit'} key={'EpsilonGreedyBandit'}>
              Epsilon-greedy bandit
            </MenuItem>
            <MenuItem value={'Roulette'} key={'Roulette'}>
              Roulette
            </MenuItem>
          </Select>
        </div>
        {isBandit(methodology) && (
          <MethodologySampleCount
            sampleCount={methodology.sampleCount}
            onChange={(sampleCount) =>
              onChange({
                ...methodology,
                sampleCount,
              })
            }
            isDisabled={isDisabled}
          />
        )}
        {methodology.name === 'EpsilonGreedyBandit' && (
          <div>
            <TextField
              type={'number'}
              InputProps={{ inputProps: { min: 0.1, max: 1, step: 0.1 } }}
              value={methodology.epsilon}
              label={'Epsilon'}
              disabled={isDisabled}
              onChange={(event) => {
                const epsilon = parseFloat(event.target.value);
                onChange({ ...methodology, epsilon });
              }}
            />
          </div>
        )}
        {isBandit(methodology) && (
          <div>
            <BanditAnalyticsButton
              testName={testName}
              channel={channel}
              sampleCount={methodology.sampleCount}
            />
          </div>
        )}
      </div>
    </div>
  );
};
