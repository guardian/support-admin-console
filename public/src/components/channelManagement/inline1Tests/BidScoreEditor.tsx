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

interface BidScoreEditorProps {
  selectedBidScore?: 'High' | 'Low';
  onBidScoreChange: (bidScore: 'High' | 'Low') => void;
  isDisabled: boolean;
}
const BidScoreEditor: React.FC<BidScoreEditorProps> = ({
  selectedBidScore,
  onBidScoreChange,
  isDisabled,
}) => {
  return (
    <Container>
      <div style={{ marginTop: 16 }}>
        <Heading>Bid score</Heading>
        <TypedRadioGroup
          selectedValue={selectedBidScore ?? 'Low'}
          onChange={onBidScoreChange}
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

export default BidScoreEditor;
