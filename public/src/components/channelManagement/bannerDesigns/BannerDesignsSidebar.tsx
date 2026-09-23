import { styled } from '@mui/material/styles';
import React from 'react';
import { BannerDesign } from '../../../models/bannerDesign';
import BannerDesignsList from './BannerDesignsList';
import NewBannerDesignButton from './NewBannerDesignButton';

const Root = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  paddingLeft: '32px',
});

const ListsContainer = styled('div')({
  position: 'relative',
  display: 'flex',
  marginTop: '8px',
});

const ButtonsContainer = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
  marginBottom: '10px',
});

interface Props {
  designs: BannerDesign[];
  selectedDesign?: BannerDesign;
  onDesignSelected: (designName: string) => void;
  createDesign: (name: string) => void;
}

const BannerDesignsSidebar = ({
  designs,
  selectedDesign,
  onDesignSelected,
  createDesign,
}: Props): React.ReactElement => {
  return (
    <Root>
      <ButtonsContainer>
        <NewBannerDesignButton
          existingNames={designs.map((c) => c.name)}
          createDesign={createDesign}
        />
      </ButtonsContainer>
      <ListsContainer>
        <BannerDesignsList
          designs={designs}
          selectedDesign={selectedDesign}
          onDesignSelected={onDesignSelected}
        />
      </ListsContainer>
    </Root>
  );
};

export default BannerDesignsSidebar;
