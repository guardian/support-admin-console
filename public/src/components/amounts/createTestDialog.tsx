import React, { useEffect, useState } from 'react';
import { Autocomplete } from '@material-ui/lab';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  makeStyles,
  TextField,
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import { Territory, Territories, CountryOptions } from '../../utils/models';

const useStyles = makeStyles(() => ({
  dialogHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingRight: '8px',
  },
  input: {
    '& input': {
      textTransform: 'uppercase !important',
    },
  },
}));

interface CreateTestDialogProps {
  isOpen: boolean;
  close: () => void;
  create: (selected: CountryOptions) => void;
  candidateTargets: Territory[];
}

// interface CountryOptions {
//   code: Territory;
//   label: string;
// }

export const CreateTestDialog: React.FC<CreateTestDialogProps> = ({
  isOpen,
  close,
  candidateTargets,
  create,
}: CreateTestDialogProps) => {
  const [options, setOptions] = useState<CountryOptions[]>([]);
  const [target, setTarget] = useState<CountryOptions | null>();

  useEffect(() => {
    const opts: CountryOptions[] = [];
    candidateTargets.forEach(c => {
      opts.push({
        code: c,
        label: Territories[c],
      });
    });
    setOptions(opts);
  }, []);

  const onSubmit = (): void => {
    if (target) {
      create(target);
      close();
    }
  };

  const classes = useStyles();

  return (
    <Dialog open={isOpen} onClose={close} aria-labelledby="create-test-dialog-title" fullWidth>
      <div className={classes.dialogHeader}>
        <DialogTitle id="create-test-dialog-title">Create new test</DialogTitle>
        <IconButton onClick={close} aria-label="close">
          <CloseIcon />
        </IconButton>
      </div>
      <DialogContent dividers>
        <Autocomplete
          value={target}
          onChange={(
            event: React.ChangeEvent<Record<string, unknown>>,
            newValue: CountryOptions | null,
          ) => {
            setTarget(newValue);
          }}
          id={'candidate-territories'}
          getOptionLabel={(option): string => option.label}
          noOptionsText={'Search for target territory...'}
          options={options}
          renderInput={(params): JSX.Element => <TextField {...params} label={'Select target'} />}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onSubmit} color="primary">
          Create test
        </Button>
      </DialogActions>
    </Dialog>
  );
};
