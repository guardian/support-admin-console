import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import { Button, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import React, { useState } from 'react';
import { RegionsAndAll } from '../../utils/models';
import BatchProcessTestButton from './batchProcessTestButton';
import { LockStatus, Test } from './helpers/shared';
import NewTestButton from './newTestButton';
import TestList from './testList';
import TestListSidebarFilterSelector from './testListSidebarFilterSelector';
import TestPriorityLabelList from './testPriorityLabelList';

const Root = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  paddingLeft: '32px',
});
const Header = styled(Typography)({
  marginTop: '5px',
  fontSize: '14px',
});
const ListsContainer = styled('div')({
  position: 'relative',
  display: 'flex',
  marginTop: '8px',
});
const PriorityLabelListContainer = styled('div')({
  position: 'absolute',
  left: '-32px',
});
const ButtonsContainer = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
  marginBottom: '10px',
});
const ReorderListButton = styled(Button)({
  height: '48px',
  justifyContent: 'start',
});
const ButtonText = styled(Typography)({
  fontSize: '12px',
  fontWeight: 500,
  textTransform: 'uppercase',
  letterSpacing: '1px',
});

interface SidebarProps<T extends Test> {
  tests: T[];
  selectedTestName: string | null;
  onTestPriorityChange: (newPriority: number, oldPriority: number) => void;
  onTestSelected: (testName: string) => void;
  testNamePrefix?: string;
  createTest: (name: string, nickname: string, campaignName?: string) => void;
  onBatchTestArchive: (batchTestNames: string[]) => void;
  onTestListOrderSave: () => void;
  onTestListLock: (force: boolean) => void;
  testListLockStatus: LockStatus;
  userHasTestListLocked: boolean;
  savingTestList: boolean;
  allowEditing: boolean;
}

function Sidebar<T extends Test>({
  tests,
  selectedTestName,
  onTestPriorityChange,
  onTestSelected,
  testNamePrefix,
  createTest,
  onBatchTestArchive,
  onTestListOrderSave,
  onTestListLock,
  testListLockStatus,
  userHasTestListLocked,
  savingTestList,
  allowEditing,
}: SidebarProps<T>): React.ReactElement<SidebarProps<T>> {
  const [regionFilter, setRegionFilter] = useState<RegionsAndAll>('ALL');

  const filterTests = function (testsToFilter: Test[]): Test[] {
    if (userHasTestListLocked || 'ALL' === regionFilter) {
      return testsToFilter;
    }

    return testsToFilter.filter(
      (t) =>
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- gutter-liveblog tests don't have regionTargeting property at runtime
        t.regionTargeting?.targetedCountryGroups.includes(regionFilter) ||
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- checkout nudge tests don't have locations property at runtime
        t.locations?.includes(regionFilter),
    );
  };

  return (
    <Root>
      <ButtonsContainer>
        <NewTestButton
          existingNames={tests.map((t) => t.name)}
          existingNicknames={tests.map((t) => t.nickname ?? '')}
          testNamePrefix={testNamePrefix}
          createTest={createTest}
          disabled={userHasTestListLocked || !allowEditing}
        />

        <BatchProcessTestButton
          // filter out live tests and any test currently being edited
          draftTests={tests.filter((t) => !(t.status === 'Live' && t.name !== selectedTestName))}
          onBatchTestArchive={onBatchTestArchive}
          disabled={!allowEditing}
        />

        {userHasTestListLocked && (
          <>
            <ReorderListButton
              variant="outlined"
              size="medium"
              startIcon={<SaveIcon />}
              onClick={savingTestList ? undefined : onTestListOrderSave}
              disabled={savingTestList}
            >
              <ButtonText>{savingTestList ? 'Saving order...' : 'Save order'}</ButtonText>
            </ReorderListButton>
            <Header>EDITING: tests in priority order</Header>
          </>
        )}

        {testListLockStatus.locked && !userHasTestListLocked && (
          <>
            <ReorderListButton
              variant="outlined"
              size="medium"
              startIcon={<EditIcon />}
              onClick={() => onTestListLock(true)}
              disabled={!allowEditing}
            >
              <ButtonText>Take control</ButtonText>
            </ReorderListButton>
            <Header>{testListLockStatus.email} has the test list locked</Header>
          </>
        )}

        {!testListLockStatus.locked && (
          <ReorderListButton
            variant="outlined"
            size="medium"
            startIcon={<EditIcon />}
            onClick={() => onTestListLock(false)}
            disabled={!allowEditing}
          >
            <ButtonText>Reorder test list</ButtonText>
          </ReorderListButton>
        )}

        {!userHasTestListLocked && (
          <TestListSidebarFilterSelector
            regionFilter={regionFilter}
            handleRegionFilterChange={setRegionFilter}
          />
        )}
      </ButtonsContainer>

      <ListsContainer>
        <PriorityLabelListContainer>
          <TestPriorityLabelList numTests={tests.length} />
        </PriorityLabelListContainer>
        <TestList
          tests={filterTests(tests)}
          isInEditMode={userHasTestListLocked}
          selectedTestName={selectedTestName}
          onTestPriorityChange={onTestPriorityChange}
          onTestSelected={onTestSelected}
        />
      </ListsContainer>
    </Root>
  );
}

export default Sidebar;
