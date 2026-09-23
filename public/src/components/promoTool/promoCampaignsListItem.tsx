import { ListItemButton, Typography } from '@mui/material';
import { grey } from '@mui/material/colors';
import { styled } from '@mui/material/styles';
import React from 'react';
import useHover from '../../hooks/useHover';
import { PromoCampaign } from './utils/promoModels';

const StyledListItem = styled(ListItemButton, {
  shouldForwardProp: (prop) => prop !== 'inverted',
})<{ inverted: boolean }>(({ inverted }) => ({
  position: 'relative',
  width: '100%',
  height: '50px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  background: 'white',
  borderRadius: '4px',
  padding: '0 12px',
  border: `1px solid ${inverted ? grey[700] : grey[400]}`,
  marginBottom: '5px',

  '&:hover': {
    background: grey[700],
  },
  ...(inverted && { background: grey[700] }),
}));
const Text = styled(Typography, {
  shouldForwardProp: (prop) => prop !== 'inverted',
})<{ inverted: boolean }>(({ inverted }) => ({
  maxWidth: '190px',
  fontSize: '12px',
  fontWeight: 500,
  lineHeight: '24px',
  textTransform: 'uppercase',
  color: inverted ? '#FFFFFF' : undefined,
}));
const LabelAndNameContainer = styled('div')({
  display: 'flex',
  alignItems: 'center',
  gap: '4px',
});

interface Props {
  promoCampaign: PromoCampaign;
  isSelected: boolean;
  onPromoCampaignSelected: (promoCampaignCode: string) => void;
}

export const PromoCampaignsListItem = ({
  promoCampaign,
  isSelected,
  onPromoCampaignSelected,
}: Props): React.ReactElement => {
  const [ref, isHovered] = useHover<HTMLDivElement>();

  const shouldInvertColor = isHovered || isSelected;

  return (
    <StyledListItem
      inverted={shouldInvertColor}
      onClick={(): void => onPromoCampaignSelected(promoCampaign.campaignCode)}
      ref={ref}
    >
      <LabelAndNameContainer>
        <Text inverted={isSelected}>{promoCampaign.name}</Text>
      </LabelAndNameContainer>
    </StyledListItem>
  );
};
