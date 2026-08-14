import { Button, Menu, MenuItem } from '@mui/material';
import React from 'react';
import { MPARTICLE_FIRST_NAME_TEMPLATE } from '../helpers/validation';

interface Props {
  insertTemplate: (template: string) => void;
}

export const MParticleTemplateMenu: React.FC<Props> = ({ insertTemplate }: Props) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleButtonClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleTemplateClick = (template: string) => {
    insertTemplate(template);
    handleClose();
  };

  return (
    <div>
      <Button
        variant="contained"
        disableElevation
        onClick={handleButtonClick}
        //endIcon={<KeyboardArrowDownIcon />}
      >
        mParticle
      </Button>
      <Menu id="demo-customized-menu" anchorEl={anchorEl} open={open} onClose={handleClose}>
        <MenuItem onClick={() => handleTemplateClick(MPARTICLE_FIRST_NAME_TEMPLATE)} disableRipple>
          First Name
        </MenuItem>
      </Menu>
    </div>
  );
};
