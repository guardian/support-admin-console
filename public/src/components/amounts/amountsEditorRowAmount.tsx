import React from 'react';
import { Button, makeStyles, Menu, MenuItem } from '@material-ui/core';
import { Amount } from './configuredAmountsEditor';

const useStyles = makeStyles(() => ({
  container: {},
}));

interface AmountsEditorRowAmount {
  amount: Amount;
  deleteAmount: () => void;
}

const AmountsEditorRowAmount: React.FC<AmountsEditorRowAmount> = ({
  amount,
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

  const classes = useStyles();

  return (
    <div className={classes.container}>
      <Button
        aria-controls="simple-menu"
        aria-haspopup="true"
        onClick={handleClick}
        variant="outlined"
        disableElevation
      >
        {amount.value}
      </Button>
      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem onClick={handleClose}>Make default</MenuItem>
        <MenuItem onClick={onDelete}>Delete</MenuItem>
      </Menu>
    </div>
  );
};

export default AmountsEditorRowAmount;
