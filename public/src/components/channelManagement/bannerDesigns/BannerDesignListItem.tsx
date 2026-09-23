import EditIcon from '@mui/icons-material/Edit';
import { ListItemButton, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import React from 'react';
import useHover from '../../../hooks/useHover';
import { BannerDesign } from '../../../models/bannerDesign';

const StyledListItemButton = styled(ListItemButton, {
  shouldForwardProp: (prop) => prop !== 'inverted',
})<{ inverted: boolean }>(({ theme, inverted }) => ({
  position: 'relative',
  height: '50px',
  width: '290px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  background: inverted ? theme.palette.grey[700] : 'white',
  borderRadius: '4px',
  padding: '0 12px',
  border: `1px solid ${theme.palette.grey[700]}`,

  '&:hover': {
    background: theme.palette.grey[700],
  },
}));

const StyledText = styled(Typography, {
  shouldForwardProp: (prop) => prop !== 'inverted',
})<{ inverted?: boolean }>(({ inverted }) => ({
  maxWidth: '190px',
  fontSize: '12px',
  fontWeight: 500,
  lineHeight: '24px',
  textTransform: 'uppercase',
  ...(inverted && { color: '#FFFFFF' }),
}));

const WhitePencil = styled(EditIcon)({
  color: 'white',
});

const LabelAndNameContainer = styled('div')({
  display: 'flex',
  alignItems: 'center',
  gap: '4px',
});

interface Props {
  design: BannerDesign;
  isSelected: boolean;
  onDesignSelected: (designName: string) => void;
  isLockedForEditing: boolean;
}

const BannerDesignListItem = ({
  design,
  isSelected,
  onDesignSelected,
  isLockedForEditing,
}: Props): React.ReactElement => {
  const [ref, isHovered] = useHover<HTMLDivElement>();

  const shouldInvertColor = isHovered || isSelected;

  return (
    <StyledListItemButton
      inverted={shouldInvertColor}
      key={design.name}
      onClick={(): void => onDesignSelected(design.name)}
      ref={ref}
    >
      <LabelAndNameContainer>
        {isLockedForEditing && (isSelected ? <WhitePencil /> : <EditIcon />)}

        <StyledText inverted={isSelected}>{design.name}</StyledText>
      </LabelAndNameContainer>
    </StyledListItemButton>
  );
};

export default BannerDesignListItem;
