import React from 'react';
import { BanditMethodology, Methodology } from './helpers/shared';
import { makeStyles } from '@mui/styles';
import { BanditAnalyticsButton } from './BanditAnalyticsButton';
import {
  Button,
  MenuItem,
  Select,
  SelectChangeEvent,
  Switch,
  TextField,
  Theme,
  Tooltip,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import Alert from '@mui/lab/Alert';
import { addMethodologyToTestName } from './helpers/methodology';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import { grey } from '@mui/material/colors';
import { LTV3DataViewer } from './LTV3DataViewer';

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
  copyNameButton: {
    marginRight: spacing(2),
    fontSize: '14px',
    fontWeight: 'normal',
    color: palette.grey[700],
    lineHeight: 1.5,
  },
  error: {
    color: 'red',
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
        onChange={event => {
          const samples = parseInt(event.target.value);
          onChange(samples);
        }}
      />
    </div>
  );
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
    } else if (value === 'Roulette') {
      onChange({ name: 'Roulette' });
    } else {
      onChange({ name: 'ABTest' });
    }
  };

  const methodologyTestName = methodology.testName;

  return (
    <div className={classes.methodologyContainer}>
      <Tooltip title={'Percentage of the audience in this methodology'}>
        <div className={classes.audiencePercentage}>{audiencePercentage}%</div>
      </Tooltip>
      <div>
        <Select value={methodology.name} disabled={isDisabled} onChange={onSelectChange}>
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
          onChange={sampleCount =>
            onChange({
              ...methodology,
              sampleCount,
            })
          }
          isDisabled={isDisabled}
        />
      )}
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
      {isBandit(methodology) && (
        <div>
          <BanditAnalyticsButton
            testName={methodology.testName ?? testName}
            channel={channel}
            sampleCount={methodology.sampleCount}
          />
        </div>
      )}
      {isBandit(methodology) && (
        <div>
          <LTV3DataViewer
            testName={methodology.testName ?? testName}
            channel={channel}
            label={'LTV3'}
            disabled={isDisabled}
          />
        </div>
      )}
      <div className={classes.testNameAndDeleteButton}>
        {methodologyTestName && (
          <Button
            className={classes.copyNameButton}
            variant="outlined"
            startIcon={<FileCopyIcon style={{ color: grey[700] }} />}
            onClick={() => {
              navigator.clipboard.writeText(methodologyTestName);
            }}
          >
            Copy test name
          </Button>
        )}
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
          key={`methodology-${testName}-${idx}`}
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
