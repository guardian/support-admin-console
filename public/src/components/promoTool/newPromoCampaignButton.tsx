import AddIcon from '@mui/icons-material/Add';
import { Button, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import React from 'react';
import useOpenable from '../../hooks/useOpenable';
import CreatePromoCampaignDialog from './createPromoCampaignDialog';
import { PromoProduct } from './utils/promoModels';

const StyledButton = styled(Button)({
  justifyContent: 'start',
  height: '48px',
});
const ButtonText = styled(Typography)({
  fontSize: '12px',
  fontWeight: 500,
  textTransform: 'uppercase',
  letterSpacing: '1px',
});

interface NewPromoCampaignButtonProps {
  createPromoCampaign: (name: string, product: PromoProduct) => void;
  existingNames: string[];
  selectedProduct: PromoProduct;
  allowEditing: boolean;
}

const NewPromoCampaignButton: React.FC<NewPromoCampaignButtonProps> = ({
  createPromoCampaign,
  existingNames,
  selectedProduct,
  allowEditing,
}: NewPromoCampaignButtonProps) => {
  const [isOpen, open, close] = useOpenable();
  return (
    <>
      <StyledButton
        variant="outlined"
        startIcon={<AddIcon className="classes.icon" />}
        onClick={open}
        disabled={!allowEditing}
      >
        <ButtonText>Create new promo campaign</ButtonText>
      </StyledButton>
      <CreatePromoCampaignDialog
        isOpen={isOpen}
        close={close}
        existingNames={existingNames}
        createPromoCampaign={createPromoCampaign}
        selectedProduct={selectedProduct}
      />
    </>
  );
};

export default NewPromoCampaignButton;
