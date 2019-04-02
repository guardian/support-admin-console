import React from 'react';
import {createStyles, Theme, withStyles, WithStyles} from "@material-ui/core";

import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

const styles = ({ palette, spacing, mixins }: Theme) => createStyles({
  amountInput: {
    display: 'inline',
    marginLeft: spacing.unit * 4
  },
  amountTextField: {
    width: '30px'
  },
  addButton: {
    minWidth: '20px'
  }
});

interface Props extends WithStyles<typeof styles> {
  addAmount: (value: string) => void
}

interface EnteredAmount {
  value: string
}

class AmountInputComponent extends React.Component<Props, EnteredAmount> {
  state: EnteredAmount;

  constructor(props: Props) {
    super(props);
    this.state = {value: ''};
  }

  addAmount = (): void => {
    if (!isNaN(parseInt(this.state.value))) {
      this.props.addAmount(this.state.value);
    }
  };

  render() {
    const { classes } = this.props;

    return (
      <div className={classes.amountInput}>
        <TextField
          className={classes.amountTextField}
          fullWidth={false}
          onChange={event => {
            const newValue = event.target.value;
            this.setState((prevState) => {
              return { value: newValue }
            });
          }}
        />
        <Button
          className={classes.addButton}
          onClick={this.addAmount}
        >
          +
        </Button>
      </div>
    )
  }
}

export default withStyles(styles)(AmountInputComponent);
