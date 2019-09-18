import React, { ReactElement } from 'react';
import {createStyles, Theme, withStyles, WithStyles, Popover, Typography} from "@material-ui/core";
import Button, { ButtonProps } from "@material-ui/core/Button";
import { SvgIcon } from 'material-ui';
import { SvgIconProps } from '@material-ui/core/SvgIcon';

const styles = ({ spacing, typography }: Theme) => createStyles({
  button: {
    marginRight: spacing.unit * 2,
    marginBottom: spacing.unit * 2
  },
  popover: {
    padding: "10px",
    width: "450px"
  },
  message: {
    fontSize: typography.pxToRem(18),
    fontWeight: typography.fontWeightMedium
  }
});

interface ButtonWithConfirmationPopupProps extends WithStyles<typeof styles> {
  buttonText: string,
  confirmationText: string | ReactElement,
  onConfirm: () => void,
  color?: ButtonProps["color"],
  icon: ReactElement<SvgIconProps>,
  disabled?: boolean
}

interface ButtonWithConfirmationPopupState {
  popoverOpen: boolean,
  anchorElement?: HTMLAnchorElement
}

class ButtonWithConfirmationPopup extends React.Component<ButtonWithConfirmationPopupProps, ButtonWithConfirmationPopupState> {
  state: ButtonWithConfirmationPopupState = {
    popoverOpen: false,
    anchorElement: undefined
  }

  onClick = (event: React.MouseEvent<HTMLAnchorElement>) =>  {
    this.setState({
      popoverOpen: true,
      anchorElement: event.currentTarget
    })
  }

  handleConfirm = () => {
    this.setState({ popoverOpen: false });
    this.props.onConfirm();
  }

  handleCancel = () => {
    this.setState({ popoverOpen: false });
  }

  render(): React.ReactNode {
    const { classes } = this.props;

    return (
      <>
        <Button
          disabled={this.props.disabled}
          variant="contained"
          color={this.props.color}
          onClick={this.onClick}
          className={classes.button}>
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
            <Button variant="contained" color="primary" onClick={this.handleConfirm}>Confirm</Button>
            <span>&nbsp;&nbsp;</span>
            <Button onClick={this.handleCancel}>Cancel</Button>
          </div>
        </Popover>
    </>
    )
  }
}

export default withStyles(styles)(ButtonWithConfirmationPopup);
