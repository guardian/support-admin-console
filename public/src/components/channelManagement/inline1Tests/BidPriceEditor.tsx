import { Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import React from 'react';
import TypedRadioGroup from '../TypedRadioGroup';

export const Container = styled('div')({
  display: 'flex',
  flexWrap: 'wrap',
});
export const Heading = styled(Typography)(({ theme }) => ({
  fontSize: 16,
  color: theme.palette.grey[900],
  fontWeight: 500,
}));

interface BidPriceEditorProps {
  selectedBidPrice?: 'High' | 'Low';
  onBidPriceChange: (bidPrice: 'High' | 'Low') => void;
  isDisabled: boolean;
}
const BidPriceEditor: React.FC<BidPriceEditorProps> = ({
  selectedBidPrice,
  onBidPriceChange,
  isDisabled,
}) => {
  return (
    <Container>
      <div style={{ marginTop: 16 }}>
        <Heading>Bid price</Heading>
        <TypedRadioGroup
          selectedValue={selectedBidPrice ?? 'Low'}
          onChange={onBidPriceChange}
          isDisabled={isDisabled}
          labels={{
            High: 'High',
            Low: 'Low',
          }}
        />
      </div>
    </Container>
  );
};

export default BidPriceEditor;
