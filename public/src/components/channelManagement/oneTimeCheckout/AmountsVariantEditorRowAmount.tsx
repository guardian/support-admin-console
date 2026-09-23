import { Button, Menu, MenuItem } from '@mui/material';
import { red } from '@mui/material/colors';
import { styled } from '@mui/material/styles';
import React from 'react';

const StyledButton = styled(Button, {
  shouldForwardProp: (prop) => prop !== 'isDefault',
})<{ isDefault: boolean }>(({ isDefault }) => ({
  ...(isDefault && { color: red[500] }),
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

  return (
    <div>
      <StyledButton
        aria-controls="simple-menu"
        aria-haspopup="true"
        onClick={handleClick}
        variant="outlined"
        disableElevation
        isDefault={isDefault}
        disabled={disabled}
      >
        {amount}
      </StyledButton>
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
