import React, { useState } from 'react';
import { AmountsTests, AmountsTest, ContributionType } from '../../utils/models';

import { AmountsTestsList } from './AmountsTestsList';
import { AmountsTestEditor } from './AmountsTestEditor';

import {
  SupportFrontendSettingsType,
  fetchSupportFrontendSettings,
  saveSupportFrontendSettings,
} from '../../utils/requests';
import withS3Data, { InnerProps, DataFromServer } from '../../hocs/withS3Data';

import { Theme } from '@mui/material/styles';
import { makeStyles } from '@mui/styles';

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
  data: configuredAmounts,
  update,
  sendToS3,
  updateAndSendToS3,
}: InnerProps<AmountsTests>) => {
  const classes = useStyles();

  const [selectedTest, setSelectedTest] = useState<AmountsTest | undefined>();

  const onTestSelected = (name: string) => {
    const currentTest = configuredAmounts.find((test) => test.testName === name);
    if (currentTest) {
      setSelectedTest({ ...currentTest });
    } else {
      setSelectedTest(undefined);
    }
  };

  const checkTestNameIsUnique = (name: string): boolean => {
    const allTestNames: string[] = [];
    configuredAmounts.forEach((t) => {
      allTestNames.push(t.testName);
      if (t.liveTestName) {
        allTestNames.push(t.liveTestName);
      }
    });
    return !allTestNames.includes(name);
  };

  const checkLiveTestNameIsUnique = (name: string, test: string): boolean => {
    const allTestNames: string[] = [];
    configuredAmounts.forEach((t) => {
      if (t.targeting.targetingType === 'Region') {
        allTestNames.push(t.testName);
      }
      if (t.liveTestName && t.testName !== test) {
        allTestNames.push(t.liveTestName);
      }
    });
    return !allTestNames.includes(name);
  };

  const checkTestLabelIsUnique = (name: string): boolean => {
    const allTestLabels: string[] = [];
    configuredAmounts.forEach((t) => {
      if (t.testLabel) {
        allTestLabels.push(t.testLabel);
      } else {
        allTestLabels.push(t.testName);
      }
    });
    return !allTestLabels.includes(name);
  };

  const createLocalTest = (name: string, label: string) => {
    if (name && label) {
      const newTest: AmountsTest = {
        testName: name,
        liveTestName: name,
        testLabel: label,
        isLive: false,
        // Only one test per region in data set, and these are evergreen (preset)
        targeting: { targetingType: 'Country', countries: [] },
        order: 0,
        // Need to calculate seed
        seed: Math.floor(Math.random() * 1000000),
        variants: [
          {
            variantName: 'CONTROL',
            defaultContributionType: 'MONTHLY' as ContributionType,
            displayContributionType: [
              'ONE_OFF' as ContributionType,
              'MONTHLY' as ContributionType,
              'ANNUAL' as ContributionType,
            ],
            amountsCardData: {
              ONE_OFF: {
                amounts: [1],
                defaultAmount: 1,
                hideChooseYourAmount: false,
              },
              MONTHLY: {
                amounts: [10],
                defaultAmount: 10,
                hideChooseYourAmount: false,
              },
              ANNUAL: {
                amounts: [100],
                defaultAmount: 100,
                hideChooseYourAmount: false,
              },
            },
          },
        ],
      };

      const updatedTests = [...configuredAmounts, newTest];
      update(updatedTests);
      setSelectedTest({ ...newTest });
    }
  };

  const updateLocalTest = (updated: AmountsTest) => {
    const updatedTests = configuredAmounts.filter((t) => t.testName !== updated.testName);
    updatedTests.push(updated);
    update(updatedTests);
  };

  const deleteLocalTest = (name: string) => {
    const updatedTests = configuredAmounts.filter((t) => t.testName !== name);
    updateAndSendToS3(updatedTests);
    setSelectedTest(undefined);
  };

  return (
    <div className={classes.body}>
      <div className={classes.leftCol}>
        <AmountsTestsList
          tests={configuredAmounts}
          selectedTest={selectedTest}
          checkTestNameIsUnique={checkTestNameIsUnique}
          checkTestLabelIsUnique={checkTestLabelIsUnique}
          onTestSelected={onTestSelected}
          create={createLocalTest}
        />
      </div>
      <div className={classes.rightCol}>
        <AmountsTestEditor
          test={selectedTest}
          checkLiveTestNameIsUnique={checkLiveTestNameIsUnique}
          saveTest={sendToS3}
          updateTest={updateLocalTest}
          deleteTest={deleteLocalTest}
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
