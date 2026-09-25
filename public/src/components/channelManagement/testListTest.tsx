import EditIcon from '@mui/icons-material/Edit';
import { ListItemButton } from '@mui/material';
import { red } from '@mui/material/colors';
import { styled } from '@mui/material/styles';
import React from 'react';
import useHover from '../../hooks/useHover';
import { Test } from './helpers/shared';
import TestListBanditIcon from './testListBanditIcon';
import TestListSchedulerLabel from './testListSchedulerLabel';
import TestListTestArticleCountLabel from './testListTestArticleCountLabel';
import TestListTestLiveLabel from './testListTestLiveLabel';
import TestListTestName from './testListTestName';

const StyledListItemButton = styled(ListItemButton, {
  shouldForwardProp: (prop) => prop !== 'live' && prop !== 'inverted',
})<{ live: boolean; inverted: boolean }>(({ theme, live, inverted }) => ({
  position: 'relative',
  height: '50px',
  width: '290px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  background: inverted ? (live ? red[500] : theme.palette.grey[700]) : 'white',
  borderRadius: '4px',
  padding: '0 12px',
  border: `1px solid ${live ? red[500] : theme.palette.grey[700]}`,
  '&:hover': {
    background: live ? red[500] : theme.palette.grey[700],
  },
}));
const Icons = styled('div')({
  display: 'flex',
  '& > * + *': {
    marginLeft: '2px',
  },
});
const LabelAndNameContainer = styled('div')({
  display: 'flex',
  alignItems: 'center',
  gap: '4px',
  overflow: 'hidden',
});
const WhitePencil = styled(EditIcon)({
  color: 'white',
});

interface TestListTestProps {
  test: Test;
  isSelected: boolean;
  isEdited: boolean;
  onClick: () => void;
}

const TestListTest: React.FC<TestListTestProps> = ({
  test,
  isSelected,
  isEdited,
  onClick,
}: TestListTestProps) => {
  const hasArticleCount = test.articlesViewedSettings !== undefined;
  const isBanditTest = test.methodologies.find(
    (method) => method.name === 'EpsilonGreedyBandit' || method.name === 'Roulette',
  );

  const [ref, isHovered] = useHover<HTMLDivElement>();

  const shouldInvertColor = isHovered || isSelected;

  return (
    <StyledListItemButton
      live={test.status === 'Live'}
      inverted={shouldInvertColor}
      onClick={onClick}
      ref={ref}
    >
      <LabelAndNameContainer>
        {isEdited && (isSelected ? <WhitePencil /> : <EditIcon />)}
        <TestListTestLiveLabel
          isLive={test.status === 'Live'}
          shouldInvertColor={shouldInvertColor}
        />
        {test.scheduler && (
          <TestListSchedulerLabel
            scheduler={test.scheduler}
            isLive={test.status === 'Live'}
            shouldInvertColor={shouldInvertColor}
          />
        )}
        <TestListTestName
          name={test.name}
          nickname={test.nickname}
          shouldInverColor={shouldInvertColor}
        />
      </LabelAndNameContainer>

      <Icons>
        {hasArticleCount && <TestListTestArticleCountLabel />}
        {isBanditTest && <TestListBanditIcon />}
      </Icons>
    </StyledListItemButton>
  );
};

export default TestListTest;
