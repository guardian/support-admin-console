import React from 'react';
import { ListItem, Theme } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { red } from '@mui/material/colors';
import { Test } from '../../helpers/shared';
import LiveStatusLabel from './liveStatusLabel';
import TestListLabel from './testListLabel';
import ArticleCountLabel from './articleCountLabel';
import useHover from '../../../../hooks/useHover';
import EditIcon from '@mui/icons-material/Edit';
import BanditIcon from './banditIcon';

const useStyles = makeStyles(({ palette }: Theme) => ({
  test: {
    position: 'relative',
    height: '50px',
    width: '290px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    background: 'white',
    borderRadius: '4px',
    padding: '0 12px',
  },
  icons: {
    display: 'flex',
    '& > * + *': {
      marginLeft: '2px',
    },
  },
  live: {
    border: `1px solid ${red[500]}`,

    '&:hover': {
      background: `${red[500]}`,
    },
  },
  liveInverted: {
    background: `${red[500]}`,
  },
  draft: {
    border: `1px solid ${palette.grey[700]}`,

    '&:hover': {
      background: `${palette.grey[700]}`,
    },
  },
  draftInverted: {
    background: `${palette.grey[700]}`,
  },
  priorityLabelContainer: {
    position: 'absolute',
    top: '0',
    bottom: '0',
    left: '-36px',
  },
  labelAndNameContainer: {
    display: 'flex',
    alignItems: 'center',
    '& > * + *': {
      marginLeft: '4px',
    },
    overflow: 'hidden',
  },
  whitePencil: {
    color: 'white',
  },
}));

interface TestListItemProps {
  test: Test;
  isSelected: boolean;
  isEdited: boolean;
  onClick: () => void;
}

const TestListItem: React.FC<TestListItemProps> = ({
  test,
  isSelected,
  isEdited,
  onClick,
}: TestListItemProps) => {
  const classes = useStyles();

  const hasArticleCount = test.articlesViewedSettings !== undefined;
  const isBanditTest = test.methodologies.find(
    method => method.name === 'EpsilonGreedyBandit' || method.name === 'Roulette',
  );

  const [ref, isHovered] = useHover<HTMLDivElement>();

  const shouldInvertColor = isHovered || isSelected;

  const containerClasses = [classes.test];
  containerClasses.push(test.status === 'Live' ? classes.live : classes.draft);
  if (shouldInvertColor) {
    containerClasses.push(test.status === 'Live' ? classes.liveInverted : classes.draftInverted);
  }

  return (
    <ListItem className={containerClasses.join(' ')} button={true} onClick={onClick} ref={ref}>
      <div className={classes.labelAndNameContainer}>
        {isEdited && (isSelected ? <EditIcon className={classes.whitePencil} /> : <EditIcon />)}
        <LiveStatusLabel
          isLive={test.status === 'Live'}
          shouldInvertColor={shouldInvertColor}
        />
        <TestListLabel
          name={test.name}
          nickname={test.nickname}
          shouldInverColor={shouldInvertColor}
        />
      </div>

      <div className={classes.icons}>
        {hasArticleCount && <ArticleCountLabel />}
        {isBanditTest && <BanditIcon />}
      </div>
    </ListItem>
  );
};

export default TestListItem;
