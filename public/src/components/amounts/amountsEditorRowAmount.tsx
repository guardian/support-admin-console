import React from 'react';
import { Button, makeStyles, Menu, MenuItem } from '@material-ui/core';
import { red } from '@material-ui/core/colors';

const useStyles = makeStyles(() => ({
  container: {},
  default: {
    color: red[500],
  },
}));

interface AmountsEditorRowAmount {
  amount: number;
  isDefault: boolean;
  setAsDefault: () => void;
  deleteAmount: () => void;
}

const AmountsEditorRowAmount: React.FC<AmountsEditorRowAmount> = ({
  amount,
  isDefault,
  setAsDefault,
  deleteAmount,
}: AmountsEditorRowAmount) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>): void => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (): void => {
    setAnchorEl(null);
  };

  const onDelete = (): void => {
    handleClose();
    deleteAmount();
  };

  const onDefault = (): void => {
    handleClose();
    setAsDefault();
  };

  const classes = useStyles();

  return (
    <div className={classes.container}>
      <Button
        aria-controls="simple-menu"
        aria-haspopup="true"
        onClick={handleClick}
        variant="outlined"
        disableElevation
        className={isDefault ? classes.default : ''}
      >
        {amount}
      </Button>
      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem onClick={onDefault}>Make default</MenuItem>
        <MenuItem onClick={onDelete}>Delete</MenuItem>
      </Menu>
    </div>
  );
};

export default AmountsEditorRowAmount;
