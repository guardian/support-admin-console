import React, { useEffect, useState } from 'react';
import { Methodology } from './helpers/shared';
import { makeStyles } from '@mui/styles';
import {
  MenuItem,
  Select,
  SelectChangeEvent,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Theme,
} from '@mui/material';

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

interface VariantData {
  variantName: string;
  mean: number;
  views: number;
}

interface BanditDataProps {
  testName: string;
  channel: string;
}

const BanditData: React.FC<BanditDataProps> = ({ testName, channel }: BanditDataProps) => {
  const [variantData, setVariantData] = useState<VariantData[]>([]);

  useEffect(() => {
    fetch(`/frontend/bandit/${channel}/${testName}`)
      .then(resp => resp.json())
      .then(data => {
        setVariantData(data);
      });
  }, [testName, channel]);

  if (variantData.length > 0) {
    return (
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Variant</TableCell>
            <TableCell>£/view</TableCell>
            <TableCell>Views</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {variantData.map(variant => (
            <TableRow key={variant.variantName}>
              <TableCell>{variant.variantName}</TableCell>
              <TableCell>{variant.mean.toFixed(4)}</TableCell>
              <TableCell>{variant.views}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  }
  return null;
};

interface TestMethodologyProps {
  methodology: Methodology;
  testName: string;
  channel: string;
  isDisabled: boolean;
  onChange: (methodology: Methodology) => void;
}

const TestMethodology: React.FC<TestMethodologyProps> = ({
  methodology,
  testName,
  channel,
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
          <BanditData testName={testName} channel={channel} />
        </>
      )}
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

  // For now we only support one methodology
  const methodology = methodologies[0] ?? { name: 'ABTest' };

  return (
    <div className={classes.container}>
      <TestMethodology
        methodology={methodology}
        testName={testName}
        channel={channel}
        isDisabled={isDisabled}
        onChange={updatedMethodology => {
          onChange([updatedMethodology]);
        }}
      />
    </div>
  );
};
