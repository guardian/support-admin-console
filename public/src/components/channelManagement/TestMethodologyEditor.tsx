import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import {
  Alert,
  Button,
  MenuItem,
  Select,
  SelectChangeEvent,
  Switch,
  TextField,
  Tooltip,
} from '@mui/material';
import { grey } from '@mui/material/colors';
import { styled } from '@mui/material/styles';
import React from 'react';
import { BanditAnalyticsButton } from './BanditAnalyticsButton';
import { addMethodologyToTestName } from './helpers/methodology';
import { BanditMethodology, Methodology } from './helpers/shared';
import { LTV3DataButton } from './public/src/components/channelManagement/LTV3DataButton';

const isBandit = (methodology: Methodology): methodology is BanditMethodology =>
  methodology.name === 'EpsilonGreedyBandit' || methodology.name === 'Roulette';

const Container = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1),
}));
const MethodologyContainer = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  border: `1px solid ${theme.palette.grey[800]}`,
  borderRadius: '4px',
  padding: theme.spacing(1),
  '& > * + *': {
    marginLeft: theme.spacing(2),
    paddingLeft: theme.spacing(2),
    borderLeft: `1px solid ${theme.palette.grey[400]}`,
  },
}));
const AudiencePercentage = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  margin: `0 ${theme.spacing(1)}`,
  fontWeight: 500,
}));
const TestNameAndDeleteButton = styled('div')({
  marginLeft: 'auto',
  display: 'flex',
  alignItems: 'center',
});
const DeleteButton = styled('div')({
  '& > button': {
    height: '100%',
  },
});
const CopyNameButton = styled(Button)(({ theme }) => ({
  marginRight: theme.spacing(2),
  fontSize: '14px',
  fontWeight: 'normal',
  color: theme.palette.grey[700],
  lineHeight: 1.5,
}));
const ErrorText = styled('div')({
  color: 'red',
});
const AddMethodologyButton = styled(Button)({
  alignSelf: 'flex-start',
});
const SampleCountContainer = styled('div')({
  display: 'flex',
  alignItems: 'center',
  fontSize: '14px',
  fontWeight: 500,
});
const SampleCountInput = styled(TextField)(({ theme }) => ({
  maxWidth: '90px',
  marginLeft: theme.spacing(1),
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
  const onSwitchChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    if (event.target.checked) {
      onChange(24);
    } else {
      onChange(undefined);
    }
  };

  return (
    <SampleCountContainer>
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
      <SampleCountInput
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
    </SampleCountContainer>
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
    <MethodologyContainer>
      <Tooltip title={'Percentage of the audience in this methodology'}>
        <AudiencePercentage>{audiencePercentage}%</AudiencePercentage>
      </Tooltip>
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
        <>
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
      <TestNameAndDeleteButton>
        {methodologyTestName && (
          <CopyNameButton
            variant="outlined"
            startIcon={<FileCopyIcon style={{ color: grey[700] }} />}
            onClick={() => {
              void navigator.clipboard.writeText(methodologyTestName);
            }}
          >
            Copy test name
          </CopyNameButton>
        )}
        <DeleteButton>
          <Button onClick={onDelete} disabled={isDisabled} variant="outlined" size="medium">
            <CloseIcon />
          </Button>
        </DeleteButton>
      </TestNameAndDeleteButton>
    </MethodologyContainer>
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
  const updateTestNamesAndSubmit = (newMethodologies: Methodology[]): void => {
    onChange(
      newMethodologies.map((method) => ({
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
    <Container>
      {methodologies.length < 1 && <ErrorText>At least one test methodology is required</ErrorText>}

      <Alert severity="info">Methodologies cannot be changed after a test has been launched</Alert>

      {methodologies.map((method, idx) => (
        <TestMethodology
          key={`methodology-${testName}-${idx}`}
          methodology={method}
          testName={testName}
          channel={channel}
          audiencePercentage={Math.round(100 / methodologies.length)}
          isDisabled={isDisabled}
          onChange={(updatedMethodology) => {
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
      <AddMethodologyButton
        onClick={onAddClick}
        disabled={isDisabled || methodologies.length >= 4}
        variant="outlined"
        size="medium"
      >
        <AddIcon />
      </AddMethodologyButton>
      <div>
        <LTV3DataButton
          testName={testName}
          channel={channel}
          label={'LTV3Data'}
          methodologies={methodologies}
        />
      </div>
    </Container>
  );
};
