import React from 'react';
import { Button, createStyles, Typography, WithStyles, withStyles } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';

import CreateTestDialog from './createTestDialog';
import useOpenable from '../../hooks/useOpenable';

const styles = createStyles({
  button: {
    borderStyle: 'dashed',
    justifyContent: 'start',
    height: '48px',
  },
  text: {
    fontSize: '12px',
    fontWeight: 500,
    textTransform: 'uppercase',
    letterSpacing: '1px',
  },
});

interface NewTestButtonProps extends WithStyles<typeof styles> {
  existingNames: string[];
  existingNicknames: string[];
  testNamePrefix?: string;
  createTest: (name: string, nickname: string) => void;
}

const NewTestButton: React.FC<NewTestButtonProps> = ({
  classes,
  existingNames,
  existingNicknames,
  testNamePrefix,
  createTest,
}: NewTestButtonProps) => {
  const [isOpen, open, close] = useOpenable();
  return (
    <>
      <Button variant="outlined" className={classes.button} startIcon={<AddIcon />} onClick={open}>
        <Typography className={classes.text}>Create a new test</Typography>
      </Button>
      <CreateTestDialog
        isOpen={isOpen}
        close={close}
        existingNames={existingNames}
        existingNicknames={existingNicknames}
        testNamePrefix={testNamePrefix}
        campaigns={[{ name: 'C1' }, { name: 'C2' }]}
        createTest={createTest}
        mode="NEW"
      />
    </>
  );
};

export default withStyles(styles)(NewTestButton);
