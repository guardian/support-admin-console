import { Box, Button, Dialog, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import React from 'react';
import useOpenable from '../../../hooks/useOpenable';
import { EpicTest } from '../../../models/epic';
import { EpicModuleName } from '../helpers/shared';
import VariantPreview from './variantPreview';

const StyledDialog = styled(Dialog)({
  padding: '10px',
});

const VariantPreviewsContainer = styled(Box)({
  display: 'flex',
  margin: '5px',
});

const VariantPreviewContainer = styled(Box)({
  margin: '5px',
});

const VariantName = styled(Typography)({
  marginBottom: '10px',
  fontSize: 26,
  fontWeight: 500,
});

interface EpicTestPreviewProps {
  test: EpicTest;
  moduleName: EpicModuleName;
}

export const EpicTestPreviewButton: React.FC<EpicTestPreviewProps> = ({
  test,
  moduleName,
}: EpicTestPreviewProps) => {
  const [isOpen, open, close] = useOpenable();

  return (
    <>
      <Button variant="outlined" onClick={open}>
        Preview all variants
      </Button>

      <StyledDialog open={isOpen} onClose={close} fullWidth maxWidth="xl">
        <VariantPreviewsContainer>
          {test.variants.map((variant) => (
            <VariantPreviewContainer key={`variant-preview-${variant.name}`}>
              <VariantName variant={'h3'}>{variant.name}</VariantName>
              <VariantPreview variant={variant} moduleName={moduleName} />
            </VariantPreviewContainer>
          ))}
        </VariantPreviewsContainer>
      </StyledDialog>
    </>
  );
};
