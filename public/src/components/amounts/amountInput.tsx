import React from 'react';
import { createStyles, Theme, withStyles, WithStyles } from '@material-ui/core';

import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const styles = ({ palette }: Theme) =>
  createStyles({
    amountInput: {
      display: 'inline',
      marginLeft: 'auto',
      paddingLeft: '8px',
      borderLeft: `1px dotted ${palette.grey['300']}`,
    },
    amountTextField: {
      width: '80px',
    },
    addButton: {
      minWidth: '20px',
      marginLeft: '5px',
    },
  });

interface Props extends WithStyles<typeof styles> {
  addAmount: (value: string) => void;
}

interface EnteredAmount {
  value: string;
}

class AmountInputComponent extends React.Component<Props, EnteredAmount> {
  state: EnteredAmount;

  constructor(props: Props) {
    super(props);
    this.state = { value: '' };
  }

  addAmount = (): void => {
    if (!isNaN(parseInt(this.state.value))) {
      this.props.addAmount(this.state.value);
    }
  };

  render(): React.ReactElement {
    const { classes } = this.props;

    return (
      <div className={classes.amountInput}>
        <TextField
          className={classes.amountTextField}
          fullWidth={false}
          type="number"
          onChange={(event): void => {
            const newValue = event.target.value;
            this.setState(() => {
              return { value: newValue };
            });
          }}
        />
        <Button className={classes.addButton} onClick={this.addAmount} variant="outlined">
          +
        </Button>
      </div>
    );
  }
}

export default withStyles(styles)(AmountInputComponent);
