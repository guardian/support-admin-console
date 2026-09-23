import { Link } from '@mui/icons-material';
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import HistoryIcon from '@mui/icons-material/History';
import LockIcon from '@mui/icons-material/Lock';
import SaveIcon from '@mui/icons-material/Save';
import { Button, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import React from 'react';
import { FrontendSettingsType } from '../../../utils/requests';
import { LockStatus, Status } from '../helpers/shared';
import TestLiveSwitch from '../testLiveSwitch';
import { TestArchiveButton } from './testArchiveButton';
import { TestCopyButton } from './testCopyButton';
import { TestLockDetails } from './testLockDetails';

const Container = styled('header')(({ theme }) => ({
  display: 'flex',
  alignItems: 'flex-start',
  justifyContent: 'space-between',
  paddingLeft: theme.spacing(3),
  paddingRight: theme.spacing(3),
  paddingTop: theme.spacing(1),
  backgroundColor: theme.palette.grey[200],
  borderBottom: `1px solid ${theme.palette.grey[500]}`,
}));
const NamesContainer = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  paddingBottom: theme.spacing(2),
}));
const MainHeader = styled(Typography)({
  fontSize: '32px',
  fontWeight: 'normal',
});
const SecondaryHeaderContainer = styled('div')({
  display: 'flex',
  marginTop: '4px',
});
const SecondaryHeader = styled(Typography)(({ theme }) => ({
  fontSize: '14px',
  color: theme.palette.grey[700],
}));
const ButtonsContainer = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignSelf: 'flex-end',
  paddingBottom: theme.spacing(1),
}));
const SwitchContainer = styled('div')({
  alignSelf: 'flex-end',
  display: 'flex',
});
const LockContainer = styled('div')(({ theme }) => ({
  alignSelf: 'flex-end',
  display: 'flex',
  gap: theme.spacing(2),
  marginLeft: theme.spacing(1),
}));
const StyledButton = styled(Button)(({ theme }) => ({
  color: theme.palette.grey[800],
  '& > p': {
    fontSize: '14px',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    fontWeight: 500,
  },
}));
const StyledLinkButton = styled(Button)(({ theme }) => ({
  marginLeft: theme.spacing(2),
  padding: '0 8px',
  fontSize: '14px',
  fontWeight: 'normal',
  color: theme.palette.grey[700],
  lineHeight: 1.5,
}));

interface StickyTopBarProps {
  name: string;
  nickname?: string;
  channel?: string;
  campaignName?: string;
  isNew: boolean;
  status: Status;
  lockStatus: LockStatus;
  userHasTestLocked: boolean;
  userHasTestListLocked: boolean;
  existingNames: string[];
  existingNicknames: string[];
  testNamePrefix?: string;
  onTestLock: (testName: string, force: boolean) => void;
  onTestUnlock: (testName: string) => void;
  onTestSave: (testName: string) => void;
  onTestArchive: () => void;
  onTestCopy: (oldName: string, newName: string, newNickname: string) => void;
  onTestAudit: (testName: string, channel?: string) => void;
  onStatusChange: (status: Status) => void;
  settingsType: FrontendSettingsType;
  allowEditing: boolean;
}

const StickyTopBar: React.FC<StickyTopBarProps> = ({
  name,
  nickname,
  channel,
  isNew,
  status,
  lockStatus,
  userHasTestLocked,
  userHasTestListLocked,
  existingNames,
  existingNicknames,
  testNamePrefix,
  onTestLock,
  onTestUnlock,
  onTestSave,
  onTestArchive,
  onTestCopy,
  onTestAudit,
  onStatusChange,
  settingsType,
  allowEditing,
}: StickyTopBarProps) => {
  const mainHeader = nickname ?? name;
  const secondaryHeader = nickname ? name : null;

  return (
    <Container>
      <NamesContainer>
        <MainHeader variant="h2">{mainHeader}</MainHeader>
        <SecondaryHeaderContainer>
          <SecondaryHeader>{secondaryHeader}</SecondaryHeader>
          <StyledLinkButton
            variant="outlined"
            startIcon={<Link />}
            onClick={() => {
              void navigator.clipboard.writeText(`${location.origin}/${settingsType}/${name}`);
            }}
          >
            Copy link
          </StyledLinkButton>
        </SecondaryHeaderContainer>
      </NamesContainer>

      <ButtonsContainer>
        <SwitchContainer>
          <TestLiveSwitch
            isLive={status === 'Live'}
            onChange={(isLive: boolean) => onStatusChange(isLive ? 'Live' : 'Draft')}
            disabled={(userHasTestLocked && lockStatus.locked) || !allowEditing} // cannot change test status while still editing it
          />
        </SwitchContainer>
        <LockContainer>
          {!userHasTestLocked && !lockStatus.locked && (
            <>
              <TestCopyButton
                existingNames={existingNames}
                existingNicknames={existingNicknames}
                sourceName={name}
                sourceNickname={nickname}
                testNamePrefix={testNamePrefix}
                onTestCopy={onTestCopy}
                disabled={userHasTestListLocked || !allowEditing}
              />
              <StyledButton
                variant="outlined"
                size="medium"
                startIcon={<EditIcon color="inherit" />}
                onClick={() => onTestLock(name, false)}
                disabled={!allowEditing}
              >
                <Typography>Edit test</Typography>
              </StyledButton>
            </>
          )}
          {!userHasTestLocked && lockStatus.locked && (
            <>
              <TestLockDetails email={lockStatus.email} timestamp={lockStatus.timestamp} />
              <StyledButton
                variant="outlined"
                size="medium"
                startIcon={<LockIcon color="inherit" />}
                onClick={() => onTestLock(name, true)}
              >
                <Typography>Take control</Typography>
              </StyledButton>
            </>
          )}
          {userHasTestLocked && (
            <>
              {!isNew && <TestArchiveButton onTestArchive={onTestArchive} />}
              <StyledButton
                variant="outlined"
                size="medium"
                startIcon={<CloseIcon color="inherit" />}
                onClick={() => onTestUnlock(name)}
              >
                <Typography>Discard</Typography>
              </StyledButton>
              <StyledButton
                variant="outlined"
                size="medium"
                startIcon={<SaveIcon color="inherit" />}
                onClick={() => onTestSave(name)}
              >
                <Typography>Save test</Typography>
              </StyledButton>
            </>
          )}
          <StyledButton
            variant="outlined"
            size="medium"
            startIcon={<HistoryIcon color="inherit" />}
            onClick={() => onTestAudit(name, channel)}
          >
            <Typography>Audit</Typography>
          </StyledButton>
        </LockContainer>
      </ButtonsContainer>
    </Container>
  );
};

export default StickyTopBar;
