import { Button } from '@mui/material';
import { styled } from '@mui/material/styles';
import React from 'react';
import useOpenable from '../../../hooks/useOpenable';
import { Test } from '../helpers/shared';
import { formattedTimestamp } from '../helpers/utilities';
import TestDataDialog from './TestDataDialog';

const StyledButton = styled(Button)({
  backgroundColor: '#fafbff',
});

interface TestDataButtonProps {
  test: Test;
}

const TestDataButton: React.FC<TestDataButtonProps> = ({ test }: TestDataButtonProps) => {
  const [isOpen, open, close] = useOpenable();

  const datetimeStamp = formattedTimestamp(Date());

  return (
    <>
      <StyledButton variant="contained" onClick={open}>
        View data
      </StyledButton>
      <TestDataDialog isOpen={isOpen} close={close} test={test} datetimeStamp={datetimeStamp} />
    </>
  );
};

export default TestDataButton;
