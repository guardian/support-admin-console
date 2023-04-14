import React, { useState } from 'react';
import { 
  Territory,
  AmountsTests,
  AmountsTest,
} from '../../utils/models';

import AmountsTestsList from './AmountsTestsList';
import AmountsTestEditor from './AmountsTestEditor';

import {
  SupportFrontendSettingsType,
  fetchSupportFrontendSettings,
  saveSupportFrontendSettings,
} from '../../utils/requests';
import withS3Data, { InnerProps, DataFromServer } from '../../hocs/withS3Data';

const AmountsForm: React.FC<InnerProps<AmountsTests>> = ({
  data,
  setData,
}: InnerProps<AmountsTests>) => {
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
    <div>
      <AmountsTestsList 
        tests={data}
        selectedTest={selectedTest?.testName || undefined}
        onTargetSelected={onTargetSelected}
        create={createTest}
      />
      <AmountsTestEditor 
        test={selectedTest}
        updateTest={saveTest}
        deleteTest={deleteTest}
      />
    </div>
  );
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const fetchSettings = (): Promise<any> =>
  fetchSupportFrontendSettings(SupportFrontendSettingsType.amounts);

const saveSettings = (data: DataFromServer<AmountsTests>): Promise<Response> =>
  saveSupportFrontendSettings(SupportFrontendSettingsType.amounts, data);

export default withS3Data<AmountsTests>(AmountsForm, fetchSettings, saveSettings);
