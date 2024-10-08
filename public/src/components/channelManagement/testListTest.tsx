import React from 'react';
import { ListItem, ListItemButton, Theme } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { red } from '@mui/material/colors';
import { Test } from './helpers/shared';
import TestListTestLiveLabel from './testListTestLiveLabel';
import TestListTestName from './testListTestName';
import TestListTestArticleCountLabel from './testListTestArticleCountLabel';
import useHover from '../../hooks/useHover';
import EditIcon from '@mui/icons-material/Edit';

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
  },
  whitePencil: {
    color: 'white',
  },
}));

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
  const classes = useStyles();

  const hasArticleCount = test.articlesViewedSettings !== undefined;

  const [ref, isHovered] = useHover<HTMLDivElement>();

  const shouldInvertColor = isHovered || isSelected;

  const containerClasses = [classes.test];
  containerClasses.push(test.status === 'Live' ? classes.live : classes.draft);
  if (shouldInvertColor) {
    containerClasses.push(test.status === 'Live' ? classes.liveInverted : classes.draftInverted);
  }

  return (
    <ListItemButton className={containerClasses.join(' ')} onClick={onClick} ref={ref}>
      <div className={classes.labelAndNameContainer}>
        {isEdited && (isSelected ? <EditIcon className={classes.whitePencil} /> : <EditIcon />)}
        <TestListTestLiveLabel
          isLive={test.status === 'Live'}
          shouldInvertColor={shouldInvertColor}
        />
        <TestListTestName
          name={test.name}
          nickname={test.nickname}
          shouldInverColor={shouldInvertColor}
        />
      </div>

      {hasArticleCount && <TestListTestArticleCountLabel />}
    </ListItemButton>
  );
};

export default TestListTest;
