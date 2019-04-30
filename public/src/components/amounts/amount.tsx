import React from 'react';
import update from 'immutability-helper';

import {createStyles, Theme, withStyles, WithStyles} from "@material-ui/core";
import {Amount} from './amounts';
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import Button from "@material-ui/core/Button";


const styles = ({ palette, spacing, mixins }: Theme) => createStyles({
  amount: {
    marginLeft: spacing.unit,
    marginRight: spacing.unit
  },
  isDefault: {
    color: 'red'
  }
});

interface Props extends WithStyles<typeof styles> {
  amount: Amount,
  deleteAmount: (amountToDelete: string) => void,
  makeDefault: (defaultAmount: string) => void
}

interface AmountState {
  amount: Amount,
  //anchor determines where on the page the right-click menu should pop-up
  anchor: HTMLElement | null
}

class AmountComponent extends React.Component<Props, AmountState> {
  state: AmountState;

  constructor(props: Props) {
    super(props);
    this.state = {
      amount: {value: ''},
      anchor: null
    };
  }

  onButtonClick = (event: React.MouseEvent<HTMLInputElement>): void => {
    this.setState({
      anchor: event.currentTarget,
      amount: this.state.amount
    });
  };

  onClose() {
    this.setState((prevState) => update(prevState, {
      anchor: {$set: null}
    }));
  }

  render() {
    const { classes } = this.props;

    return (
      <div>
        <Button
          className={this.props.classes.amount + (this.props.amount.isDefault ? ` ${this.props.classes.isDefault}` : '') }
          onClick={this.onButtonClick}
          variant='outlined'
        >
          {this.props.amount.value}
        </Button>

        <Menu
          open={Boolean(this.state.anchor)}
          onClose={event => {
            this.onClose()
          }}
          anchorEl={this.state.anchor}
        >
          { this.props.amount.isDefault ? null :
              <MenuItem
                onClick={() => {
                  this.props.makeDefault(this.props.amount.value);
                  this.onClose();
                }}
              >
                Make default
              </MenuItem>
          }

          <MenuItem
            onClick={() => {
              this.props.deleteAmount(this.props.amount.value);
              this.onClose();
            }}
          >
            Delete
          </MenuItem>
        </Menu>
      </div>
    )
  }
}

export default withStyles(styles)(AmountComponent);
