import React, { useState } from 'react';
import { 
  Territories,
  Territory,
  AmountsTests,
  AmountsTest,
  Regions,
  Countries,
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
  saveData,
  saving: boolean,
}: InnerProps<AmountsTests>) => {

  // const [currentTests, setCurrentTests] = useState(data || []);
  const [selectedTest, setSelectedTest] = useState<AmountsTest | undefined>();
  // const [saving, setSaving] = useState(false);
  // const [creating, setCreating] = useState(false);

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
    saveData(updatedTests);
  };

  const createTest = () => {

  };

  const deleteTest = (test: AmountsTest) => {
    const updatedTests = data.filter(t => t.testName !== test.testName);
    saveData(updatedTests);
  };

  return (
    <div>
      <AmountsTestsList 
        tests={data}
        selectedTest={selectedTest?.testName || undefined}
        onTargetSelected={onTargetSelected}
        save={saveTest}
        saving={saving}
        create={createTest}
        creating={creating}
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










// import React, { useState } from 'react';

// import { makeStyles, Theme } from '@material-ui/core/styles';

// import Sidebar from './sidebar';
// import ConfiguredRegionAmountsEditor from './configuredRegionAmountsEditor';

// import { ContributionType, Region, getPrettifiedRegionName } from '../../utils/models';
// import {
//   SupportFrontendSettingsType,
//   fetchSupportFrontendSettings,
//   saveSupportFrontendSettings,
// } from '../../utils/requests';
// import withS3Data, { InnerProps, DataFromServer } from '../../hocs/withS3Data';

// export interface AmountSelection {
//   amounts: number[];
//   defaultAmount: number;
//   hideChooseYourAmount?: boolean;
// }

// export type ContributionAmounts = {
//   [key in ContributionType]: AmountSelection;
// };

// export interface AmountsTestVariant {
//   name: string;
//   amounts: ContributionAmounts;
// }

// export interface AmountsTest {
//   name: string;
//   isLive: boolean;
//   variants: AmountsTestVariant[];
//   seed: number;
// }

// export type ConfiguredRegionAmounts = {
//   control: ContributionAmounts;
//   test?: AmountsTest;
// };

// export type ConfiguredAmounts = {
//   [key in Region]: ConfiguredRegionAmounts;
// };

// const useStyles = makeStyles(({ spacing }: Theme) => ({
//   body: {
//     display: 'flex',
//     overflow: 'hidden',
//     flexGrow: 1,
//     width: '100%',
//     height: '100%',
//   },
//   leftCol: {
//     height: '100%',
//     flexShrink: 0,
//     overflowY: 'auto',
//     background: 'white',
//     paddingTop: spacing(6),
//     paddingLeft: spacing(6),
//     paddingRight: spacing(6),
//   },
//   rightCol: {
//     overflowY: 'auto',
//     flexGrow: 1,
//     display: 'flex',
//     flexDirection: 'column',
//     alignItems: 'flex-start',
//     paddingTop: spacing(6),
//     paddingLeft: spacing(6),
//   },
// }));

// const ConfiguredAmountsEditor: React.FC<InnerProps<ConfiguredAmounts>> = ({
//   data: configuredAmounts,
//   setData: setConfiguredAmounts,
//   saveData: saveConfiguredAmounts,
//   saving,
// }: InnerProps<ConfiguredAmounts>) => {
//   const classes = useStyles();
//   const [selectedRegion, setSelectedRegion] = useState<Region>(Region.GBPCountries);

//   const selectedRegionPrettifiedName = getPrettifiedRegionName(selectedRegion);
//   const selectedRegionAmounts = configuredAmounts[selectedRegion];

//   const updateConfiguredRegionAmounts = (configuredRegionAmounts: ConfiguredRegionAmounts): void =>
//     setConfiguredAmounts({ ...configuredAmounts, [selectedRegion]: configuredRegionAmounts });

//   const existingTestNames = Object.values(configuredAmounts)
//     .map(regionAmounts => regionAmounts.test?.name || '')
//     .filter(name => !!name);

//   return (
//     <div className={classes.body}>
//       <div className={classes.leftCol}>
//         <Sidebar
//           onRegionSelected={setSelectedRegion}
//           save={saveConfiguredAmounts}
//           saving={saving}
//         />
//       </div>
//       <div className={classes.rightCol}>
//         <ConfiguredRegionAmountsEditor
//           label={selectedRegionPrettifiedName}
//           configuredRegionAmounts={selectedRegionAmounts}
//           updateConfiguredRegionAmounts={updateConfiguredRegionAmounts}
//           existingTestNames={existingTestNames}
//         />
//       </div>
//     </div>
//   );
// };

// // eslint-disable-next-line @typescript-eslint/no-explicit-any
// const fetchSettings = (): Promise<any> =>
//   fetchSupportFrontendSettings(SupportFrontendSettingsType.amounts);

// const saveSettings = (data: DataFromServer<ConfiguredAmounts>): Promise<Response> =>
//   saveSupportFrontendSettings(SupportFrontendSettingsType.amounts, data);

// export default withS3Data<ConfiguredAmounts>(ConfiguredAmountsEditor, fetchSettings, saveSettings);
