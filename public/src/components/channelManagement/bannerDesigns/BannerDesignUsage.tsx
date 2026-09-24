import { OpenInNew } from '@mui/icons-material';
import { List, ListItemButton, ListItemText } from '@mui/material';
import { styled } from '@mui/material/styles';
import React, { useEffect, useState } from 'react';
import { getBannerDesignUsage } from '../../../utils/requests';

const StyledList = styled(List)(({ theme }) => ({
  marginTop: theme.spacing(2),
  maxWidth: '500px',
}));

const Item = styled(ListItemButton)(({ theme }) => ({
  '& > :first-child': {
    marginRight: theme.spacing(2),
  },
})) as typeof ListItemButton;

interface Test {
  name: string;
  channel: string;
}

interface Props {
  designName: string;
}

export const BannerDesignUsage: React.FC<Props> = ({ designName }: Props) => {
  const [testNames, setTestNames] = useState<Test[]>([]);

  useEffect(() => {
    void getBannerDesignUsage(designName).then((tests) => setTestNames(tests));
  }, [designName]);

  const TestButton = (test: Test) => {
    const channelPart = test.channel === 'Banner1' ? 'banner-tests' : 'banner-tests2';
    const path = channelPart + '/' + test.name;
    return (
      <Item href={`/${path}`} target="_blank">
        <OpenInNew />
        <ListItemText primary={test.name} />
      </Item>
    );
  };

  return (
    <StyledList>
      {testNames.length === 0
        ? 'Not currently used by any banner tests'
        : testNames.map((test) => (
            <TestButton
              key={`${test.channel}/${test.name}`}
              name={test.name}
              channel={test.channel}
            />
          ))}
    </StyledList>
  );
};
