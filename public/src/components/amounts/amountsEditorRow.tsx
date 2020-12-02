import React from 'react';
import { Button, makeStyles, Theme } from '@material-ui/core';
import { Amount } from './configuredAmountsEditor';

const useStyles = makeStyles(({ spacing, palette }: Theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',

    '& > * + *': {
      marginLeft: spacing(4),
    },
  },
  amountsLabel: {
    width: 80,
    textTransform: 'uppercase',
    fontWeight: 'bold',
    color: palette.grey[800],
  },
  amountsContainer: {
    '& > * + *': {
      marginLeft: spacing(2),
    },
  },
}));

interface AmountsEditorRowProps {
  label: string;
  amounts: Amount[];
}

const AmountsEditorRow: React.FC<AmountsEditorRowProps> = ({
  label,
  amounts,
}: AmountsEditorRowProps) => {
  const classes = useStyles();

  return (
    <div className={classes.container}>
      <div className={classes.amountsLabel}>{label}</div>
      <div className={classes.amountsContainer}>
        {amounts.map(amount => (
          <Button key={amount.value} variant="outlined" disableElevation>
            {amount.value}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default AmountsEditorRow;
