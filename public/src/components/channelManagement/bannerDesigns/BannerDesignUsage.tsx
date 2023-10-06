import React, { useEffect, useState } from 'react';
import { getBannerDesignUsage } from '../../../utils/requests';
import { List, ListItemText } from '@material-ui/core';
import { ListItemButton } from '@mui/material';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { OpenInNew } from '@material-ui/icons';

export const useLocalStyles = makeStyles(({ spacing }: Theme) => ({
  list: {
    marginTop: spacing(2),
    maxWidth: '500px',
  },
  item: {
    '& > :first-child': {
      marginRight: spacing(2),
    },
  },
}));

interface Test {
  name: string;
  channel: string;
}

interface Props {
  designName: string;
}

export const BannerDesignUsage: React.FC<Props> = ({ designName }: Props) => {
  const localClasses = useLocalStyles();
  const [testNames, setTestNames] = useState<Test[]>([]);

  useEffect(() => {
    getBannerDesignUsage(designName).then(tests => setTestNames(tests));
  }, [designName]);

  const TestButton = (test: Test) => {
    const channelPart = test.channel === 'Banner1' ? 'banner-tests' : 'banner-tests2';
    const path = channelPart + '/' + test.name;
    return (
      <ListItemButton className={localClasses.item} href={`/${path}`} target="_blank">
        <OpenInNew />
        <ListItemText primary={test.name} />
      </ListItemButton>
    );
  };

  return (
    <List className={localClasses.list}>
      {testNames.length === 0
        ? 'Not currently used by any banner tests'
        : testNames.map(test => (
            <TestButton
              key={`${test.channel}/${test.name}`}
              name={test.name}
              channel={test.channel}
            />
          ))}
    </List>
  );
};
