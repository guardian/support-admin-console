import React, { useState } from 'react';
import {
  Territory,
  AmountsTests,
  AmountsTest,
  CountryOptions,
  ContributionType,
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
  data: configuredAmounts,
  setData: setConfiguredAmounts,
  saveData: saveConfiguredAmounts,
}: InnerProps<AmountsTests>) => {
  const classes = useStyles();

  const [selectedTest, setSelectedTest] = useState<AmountsTest | undefined>();

  const onTargetSelected = (target: Territory) => {
    const currentTest = configuredAmounts.filter(test => test.target === target);
    if (currentTest.length) {
      setSelectedTest(currentTest[0]);
    } else {
      setSelectedTest(undefined);
    }
  };

  const createLocalTest = (selected: CountryOptions) => {
    if (selected && selected.label && selected.code) {
      const newTest = {
        testName: `SUPPORTER_AMOUNTS_EVERGREEN__${selected.code}`,
        liveTestName: `SUPPORTER_AMOUNTS_AB_TEST__${selected.code}`,
        isLive: false,
        target: selected.code,
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
      setConfiguredAmounts(updatedTests);
      setSelectedTest(newTest);
    }
  };

  const updateLocalTest = (updated: AmountsTest) => {
    const updatedTests = configuredAmounts.filter(t => t.testName !== updated.testName);
    updatedTests.push(updated);
    setConfiguredAmounts(updatedTests);
  };

  const deleteLocalTest = (test: AmountsTest) => {
    const updatedTests = configuredAmounts.filter(t => t.testName !== test.testName);
    console.log('deleteLocalTest - setConfiguredAmounts', updatedTests);
    setConfiguredAmounts(updatedTests);
    setSelectedTest(undefined);
  };

  const saveLocalTestToS3 = () => {
    console.log('saveLocalTestToS3 - saveConfiguredAmounts');
    saveConfiguredAmounts();
  };

  const getAllTestNames = () => {
    const namesArray: string[] = [];
    configuredAmounts.forEach(t => {
      if (t.testName === selectedTest?.testName) {
        namesArray.push(t.testName);
      } else {
        namesArray.push(t.testName);
        if (t.liveTestName) {
          namesArray.push(t.liveTestName);
        }
      }
    });
    return namesArray;
  };

  return (
    <div className={classes.body}>
      <div className={classes.leftCol}>
        <AmountsTestsList
          tests={configuredAmounts}
          selectedTest={selectedTest?.target}
          onTargetSelected={onTargetSelected}
          create={createLocalTest}
        />
      </div>
      <div className={classes.rightCol}>
        <AmountsTestEditor
          test={selectedTest}
          testNames={getAllTestNames()}
          saveTest={saveLocalTestToS3}
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
