import React, { ReactElement } from 'react';
import {
  createStyles,
  Theme,
  withStyles,
  WithStyles,
  Popover,
  Typography,
} from '@material-ui/core';
import Button, { ButtonProps } from '@material-ui/core/Button';
import { SvgIconProps } from '@material-ui/core/SvgIcon';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const styles = ({ spacing, typography }: Theme) =>
  createStyles({
    button: {
      marginBottom: spacing(2),
    },
    popover: {
      padding: '10px',
      width: '450px',
    },
    message: {
      fontSize: typography.pxToRem(18),
      fontWeight: typography.fontWeightMedium,
      marginBottom: spacing(1),
    },
  });

interface ButtonWithConfirmationPopupProps extends WithStyles<typeof styles> {
  buttonText: string;
  confirmationText: string | ReactElement;
  onConfirm: () => void;
  color?: ButtonProps['color'];
  icon: ReactElement<SvgIconProps>;
  disabled?: boolean;
}

interface ButtonWithConfirmationPopupState {
  popoverOpen: boolean;
  anchorElement?: HTMLButtonElement;
}

class ButtonWithConfirmationPopup extends React.Component<
  ButtonWithConfirmationPopupProps,
  ButtonWithConfirmationPopupState
> {
  state: ButtonWithConfirmationPopupState = {
    popoverOpen: false,
    anchorElement: undefined,
  };

  onClick = (event: React.MouseEvent<HTMLButtonElement>): void => {
    this.setState({
      popoverOpen: true,
      anchorElement: event.currentTarget,
    });
  };

  handleConfirm = (): void => {
    this.setState({ popoverOpen: false });
    this.props.onConfirm();
  };

  handleCancel = (): void => {
    this.setState({ popoverOpen: false });
  };

  render(): React.ReactNode {
    const { classes } = this.props;

    return (
      <>
        <Button
          disabled={this.props.disabled}
          variant="contained"
          color={this.props.color}
          onClick={this.onClick}
          className={classes.button}
        >
          {this.props.icon}&nbsp;{this.props.buttonText}
        </Button>
        <Popover
          open={this.state.popoverOpen}
          anchorEl={this.state.anchorElement}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }}
        >
          <div className={classes.popover}>
            <Typography className={classes.message}>{this.props.confirmationText}</Typography>
            <Button variant="contained" color="primary" onClick={this.handleConfirm}>
              Confirm
            </Button>
            <span>&nbsp;&nbsp;</span>
            <Button onClick={this.handleCancel}>Cancel</Button>
          </div>
        </Popover>
      </>
    );
  }
}

export default withStyles(styles)(ButtonWithConfirmationPopup);
