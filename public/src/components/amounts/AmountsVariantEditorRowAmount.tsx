import { Button, Menu, MenuItem } from '@mui/material';
import { red } from '@mui/material/colors';
import { makeStyles } from '@mui/styles';
import React from 'react';

const useStyles = makeStyles(() => ({
  default: {
    color: red[500],
  },
}));

interface AmountsVariantEditorRowAmountPrefs {
  amount: number;
  isDefault: boolean;
  setAsDefault: () => void;
  deleteAmount: () => void;
  disabled?: boolean;
}

export const AmountsVariantEditorRowAmount: React.FC<AmountsVariantEditorRowAmountPrefs> = ({
  amount,
  isDefault,
  setAsDefault,
  deleteAmount,
  disabled = false,
}: AmountsVariantEditorRowAmountPrefs) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const buttonRef = React.useRef<HTMLButtonElement | null>(null);
  const menuId = `amount-menu-${amount}`;

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>): void => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (): void => {
    setAnchorEl(null);
    buttonRef.current?.focus();
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
    <div>
      <Button
        ref={buttonRef}
        aria-controls={anchorEl ? menuId : undefined}
        aria-haspopup="true"
        onClick={handleClick}
        variant="outlined"
        disableElevation
        className={isDefault ? classes.default : ''}
        disabled={disabled}
      >
        {amount}
      </Button>
      <Menu id={menuId} anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
        <MenuItem onClick={onDefault}>Make default</MenuItem>
        <MenuItem onClick={onDelete}>Delete</MenuItem>
      </Menu>
    </div>
  );
};
