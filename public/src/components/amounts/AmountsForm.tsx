import React, { useState } from 'react';
import { 
  Territory,
  AmountsTests,
  AmountsTest,
} from '../../utils/models';

import { AmountsTestsList } from './AmountsTestsList';
import { AmountsTestEditor } from './AmountsTestEditor';

import {
  SupportFrontendSettingsType,
  fetchSupportFrontendSettings,
  saveSupportFrontendSettings,
} from '../../utils/requests';
import withS3Data, { InnerProps, DataFromServer } from '../../hocs/withS3Data';

import { makeStyles, Theme } from '@material-ui/core/styles';

const useStyles = makeStyles(({ spacing }: Theme) => ({
  body: {
    display: 'flex',
    overflow: 'hidden',
    flexGrow: 1,
    width: '100%',
    height: '100%',
  },
  leftCol: {
    height: '100%',
    flexShrink: 0,
    overflowY: 'auto',
    background: 'white',
    paddingTop: spacing(6),
    paddingLeft: spacing(6),
    paddingRight: spacing(6),
  },
  rightCol: {
    overflowY: 'auto',
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    paddingTop: spacing(6),
    paddingLeft: spacing(6),
  },
}));

const AmountsForm: React.FC<InnerProps<AmountsTests>> = ({
  data,
  setData,
}: InnerProps<AmountsTests>) => {
  const classes = useStyles();

  const [selectedTest, setSelectedTest] = useState<AmountsTest | undefined>();

  const onTargetSelected = (target: Territory) => {
    const currentTest = data.filter(test => test.target === target);
    if (currentTest.length) {
      setSelectedTest(currentTest[0]);
    }
    else {
      setSelectedTest(undefined);
    }
  };

  const saveTest = (updated: AmountsTest) => {
    const updatedTests = data.filter(t => t.testName !== updated.testName);
    updatedTests.push(updated);
    setData(updatedTests);
  };

  const createTest = () => {

  };

  const deleteTest = (test: AmountsTest) => {
    const updatedTests = data.filter(t => t.testName !== test.testName);
    setData(updatedTests);
  };

  return (
    <div className={classes.body}>
      <div className={classes.leftCol}>
        <AmountsTestsList 
          tests={data}
          selectedTest={selectedTest?.target}
          onTargetSelected={onTargetSelected}
          create={createTest}
        />
      </div>
      <div className={classes.rightCol}>
        <AmountsTestEditor 
          test={selectedTest}
          updateTest={saveTest}
          deleteTest={deleteTest}
        />
      </div>
    </div>
  );
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const fetchSettings = (): Promise<any> =>
  fetchSupportFrontendSettings(SupportFrontendSettingsType.amounts);

const saveSettings = (data: DataFromServer<AmountsTests>): Promise<Response> =>
  saveSupportFrontendSettings(SupportFrontendSettingsType.amounts, data);

export default withS3Data<AmountsTests>(AmountsForm, fetchSettings, saveSettings);
