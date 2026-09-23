import { Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import React from 'react';

const Container = styled('div')({
  display: 'flex',
  height: '50px',
  padding: '4px 0',
});
const Text = styled(Typography)(({ theme }) => ({
  fontSize: '12px',
  color: theme.palette.grey[700],
}));
const DashedLinesContainer = styled('div')({
  display: 'flex',
  marginLeft: '4px',
  '& > * + *': {
    marginLeft: '2px',
  },
});
const DashedLine = styled('div')({
  height: '100%',
  borderLeft: '1px dashed #9E9E9E',
});

interface TestPriorityLabelListLabelProps {
  priority: number;
}

const TestPriorityLabelListLabel: React.FC<TestPriorityLabelListLabelProps> = ({
  priority,
}: TestPriorityLabelListLabelProps) => {
  return (
    <Container>
      <Text noWrap={true}>{priority + 1}</Text>
      <DashedLinesContainer>
        <DashedLine />
        <DashedLine />
      </DashedLinesContainer>
    </Container>
  );
};

export default TestPriorityLabelListLabel;
