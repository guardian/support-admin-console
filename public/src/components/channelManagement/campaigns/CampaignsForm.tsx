import React, { useState } from 'react';
import { makeStyles, Theme } from '@material-ui/core';
import CampaignsSidebar from './CampaignsSidebar';
import CampaignsEditor from './CampaignsEditor';

import {
  fetchFrontendSettings,
  FrontendSettingsType,
  saveFrontendSettings,
} from '../../../utils/requests';

import withS3Data, { DataFromServer, InnerProps } from '../../../hocs/withS3Data';

const useStyles = makeStyles(({ spacing, typography }: Theme) => ({
  viewTextContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: '-50px',
  },
  viewText: {
    fontSize: typography.pxToRem(16),
  },
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
    flexGrow: 1,
    display: 'flex',
    justifyContent: 'center',
  },
}));

export interface Campaign {
  name: string;
  nickname: string;
  description?: string;
}
export type Campaigns = Campaign[];

const CampaignsForm: React.FC<InnerProps<Campaigns>> = ({
  data: campaigns,
  setData: setCampaigns,
  saveData: saveCampaigns,
}: InnerProps<Campaigns>) => {
  const classes = useStyles();

  const createCampaign = (campaign: Campaign): void => {
    setCampaigns([...campaigns, campaign]);
    console.log('createCampaign', campaigns);
  };

  const saveCampaign = (campaign: Campaign): void => {
    const removed = campaigns.filter(c => c.name !== campaign.name);
    setCampaigns([...removed, campaign]);
    console.log('saveCampaign', campaigns);
  };

  const deleteCampaign = (campaign: Campaign): void => {
    setCampaigns(campaigns.filter(c => c.name !== campaign.name));
    console.log('deleteCampaign', campaigns);
  };

  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | undefined>();

  const onCampaignSelected = (name: string) => {
    const requiredCampaign = campaigns.filter(c => c.name === name);
    setSelectedCampaign(requiredCampaign[0]);
  };

  return (
    <div className={classes.body}>
      <div className={classes.leftCol}>
        <CampaignsSidebar
          campaigns={campaigns}
          createCampaign={createCampaign}
          selectedCampaignName=""
          onCampaignSelected={onCampaignSelected}
          // tests={tests}
          // selectedTestName={selectedTestName}
          // testNamePrefix={testNamePrefix}
          // onTestPriorityChange={onTestPriorityChange}
          // onTestSelected={setSelectedTestName}
          // createTest={onTestCreate}
          // onBatchTestArchive={onTestsArchive}
          // onTestListOrderSave={onTestListOrderSave}
          // onTestListLock={onTestListLock}
          // testListLockStatus={testListLockStatus}
          // userHasTestListLocked={testListLockStatus.email === email}
          // savingTestList={savingTestList}
        />
      </div>

      <div className={classes.rightCol}>
        {/*          {selectedTest ? (
            <CampaignsEditor
              // test={selectedTest}
              // userHasTestLocked={selectedTest.lockStatus?.email === email}
              // userHasTestListLocked={userHasTestListLocked}
              // existingNames={tests.map(test => test.name)}
              // existingNicknames={tests.map(test => test.nickname || '')}
              // onTestChange={onTestChange}
              // onTestLock={onTestLock}
              // onTestUnlock={onTestUnlock}
              // onTestSave={onTestSave}
              // onTestArchive={onTestArchive}
              // onTestCopy={onTestCopy}
            />
          ) : (
            <div className={classes.viewTextContainer}>
              <Typography className={classes.viewText}>
                Select an existing campaign from the menu,
              </Typography>
              <Typography className={classes.viewText}>or create a new one</Typography>
            </div>
          )}
*/}
        <CampaignsEditor
          campaign={selectedCampaign}
          existingNames={campaigns.map(c => c.name)}
          existingNicknames={campaigns.map(c => c.nickname)}
        />
      </div>
    </div>
  );
};

const fetchSettings = (): Promise<DataFromServer<Campaigns>> =>
  fetchFrontendSettings(FrontendSettingsType.campaigns);
const saveSettings = (data: DataFromServer<Campaigns>): Promise<Response> =>
  saveFrontendSettings(FrontendSettingsType.campaigns, data);

export default withS3Data<Campaigns>(CampaignsForm, fetchSettings, saveSettings);

// export default CampaignsForm;
