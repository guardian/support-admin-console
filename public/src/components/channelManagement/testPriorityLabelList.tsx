import { List } from '@mui/material';
import { styled } from '@mui/material/styles';
import React from 'react';
import TestPriorityLabelListLabel from './testPriorityLabelListLabel';

const StyledList = styled(List)({
  marginTop: 0,
  padding: 0,
  '& > * + *': {
    marginTop: '8px',
  },
});

interface TestPriorityLabelListProps {
  numTests: number;
}

const MAX_PRIORITY_TO_DISPLAY_LABEL_FOR = 5;

const TestPriorityLabelList: React.FC<TestPriorityLabelListProps> = ({
  numTests,
}: TestPriorityLabelListProps) => {
  const maxPriorityLabel = Math.min(numTests, MAX_PRIORITY_TO_DISPLAY_LABEL_FOR);

  return (
    <StyledList>
      {[...Array(maxPriorityLabel).keys()].map((priority) => (
        <TestPriorityLabelListLabel key={priority} priority={priority} />
      ))}
    </StyledList>
  );
};

export default TestPriorityLabelList;
