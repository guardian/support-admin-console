import { List } from '@mui/material';
import { styled } from '@mui/material/styles';
import React from 'react';
import { BannerDesign } from '../../../models/bannerDesign';
import BannerDesignListItem from './BannerDesignListItem';

const Container = styled('div')({
  marginTop: '16px',
});

const StyledList = styled(List)({
  padding: 0,
  marginTop: 0,
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
});

interface Props {
  designs: BannerDesign[];
  selectedDesign?: BannerDesign;
  onDesignSelected: (designName: string) => void;
}

const BannerDesignsList = ({
  designs,
  selectedDesign,
  onDesignSelected,
}: Props): React.ReactElement => {
  return (
    <Container>
      <StyledList>
        {designs.map((design) => {
          const isSelected = Boolean(selectedDesign?.name === design.name);

          return (
            <BannerDesignListItem
              key={design.name}
              design={design}
              isSelected={isSelected}
              isLockedForEditing={Boolean(design.lockStatus?.locked)}
              onDesignSelected={(): void => onDesignSelected(design.name)}
            />
          );
        })}
      </StyledList>
    </Container>
  );
};

export default BannerDesignsList;
