import React from 'react';
import { Methodology } from './helpers/shared';
import { makeStyles } from '@mui/styles';
import { BanditAnalyticsButton } from './BanditAnalyticsButton';
import {
  Button,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
  Theme,
  Tooltip,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import Alert from '@mui/lab/Alert';
import { addMethodologyToTestName } from './helpers/methodology';

const isBandit = (methodology: Methodology): boolean => methodology.name === 'EpsilonGreedyBandit';

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
  audiencePercentage: {
    display: 'flex',
    alignItems: 'center',
    margin: `0 ${spacing(1)}`,
    fontWeight: 500,
  },
  testNameAndDeleteButton: {
    marginLeft: 'auto',
    display: 'flex',
    alignItems: 'center',
  },
  deleteButton: {
    '& > button': {
      height: '100%',
    },
  },
  testName: {
    marginRight: spacing(2),
    fontWeight: 500,
  },
  error: {
    color: 'red',
  },
}));

const defaultEpsilonGreedyBandit: Methodology = {
  name: 'EpsilonGreedyBandit',
  epsilon: 0.1,
};

interface TestMethodologyProps {
  methodology: Methodology;
  testName: string;
  channel: string;
  audiencePercentage: number;
  isDisabled: boolean;
  onChange: (methodology: Methodology) => void;
  onDelete: () => void;
}

const TestMethodology: React.FC<TestMethodologyProps> = ({
  methodology,
  testName,
  channel,
  audiencePercentage,
  isDisabled,
  onChange,
  onDelete,
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
      <Tooltip title={'Percentage of the audience in this methodology'}>
        <div className={classes.audiencePercentage}>{audiencePercentage}%</div>
      </Tooltip>
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
      {methodology.name === 'EpsilonGreedyBandit' && (
        <>
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
        </>
      )}
      {isBandit(methodology) && <BanditAnalyticsButton testName={testName} channel={channel} />}
      <div className={classes.testNameAndDeleteButton}>
        {methodology.testName && <div className={classes.testName}>{methodology.testName}</div>}
        <div className={classes.deleteButton}>
          <Button onClick={onDelete} disabled={isDisabled} variant="outlined" size="medium">
            <CloseIcon />
          </Button>
        </div>
      </div>
    </div>
  );
};

interface TestMethodologyEditorProps {
  methodologies: Methodology[];
  testName: string;
  channel: string;
  onChange: (methodologies: Methodology[]) => void;
  isDisabled: boolean;
}

export const TestMethodologyEditor: React.FC<TestMethodologyEditorProps> = ({
  methodologies,
  testName,
  channel,
  onChange,
  isDisabled,
}: TestMethodologyEditorProps) => {
  const classes = useStyles();

  const updateTestNamesAndSubmit = (newMethodologies: Methodology[]): void => {
    onChange(
      newMethodologies.map(method => ({
        ...method,
        // Add testNames if more than 1 methodology
        testName:
          newMethodologies.length > 1 ? addMethodologyToTestName(testName, method) : undefined,
      })),
    );
  };
  const onAddClick = () => {
    updateTestNamesAndSubmit([...methodologies, { name: 'ABTest' }]);
  };

  return (
    <div className={classes.container}>
      {methodologies.length < 1 && (
        <div className={classes.error}>At least one test methodology is required</div>
      )}

      <Alert severity="info">Methodologies cannot be changed after a test has been launched</Alert>

      {methodologies.map((method, idx) => (
        <TestMethodology
          key={`methodology-${idx}`}
          methodology={method}
          testName={testName}
          channel={channel}
          audiencePercentage={Math.round(100 / methodologies.length)}
          isDisabled={isDisabled}
          onChange={updatedMethodology => {
            const updatedMethodologies = [
              ...methodologies.slice(0, idx),
              updatedMethodology,
              ...methodologies.slice(idx + 1),
            ];
            updateTestNamesAndSubmit(updatedMethodologies);
          }}
          onDelete={() => {
            const updatedMethodologies = [
              ...methodologies.slice(0, idx),
              ...methodologies.slice(idx + 1),
            ];
            updateTestNamesAndSubmit(updatedMethodologies);
          }}
        />
      ))}
      <Button
        onClick={onAddClick}
        disabled={isDisabled || methodologies.length >= 4}
        variant="outlined"
        size="medium"
      >
        <AddIcon />
      </Button>
    </div>
  );
};
