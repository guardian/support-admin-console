import ArchiveIcon from '@mui/icons-material/Archive';
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import LockIcon from '@mui/icons-material/Lock';
import SaveIcon from '@mui/icons-material/Save';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Tooltip,
  Typography,
} from '@mui/material';
import { grey } from '@mui/material/colors';
import { styled } from '@mui/material/styles';
import React from 'react';
import useOpenable from '../../../hooks/useOpenable';
import { BannerDesign, Status } from '../../../models/bannerDesign';
import LiveSwitch from '../../shared/liveSwitch';
import { LockStatus } from '../helpers/shared';
import { BannerDesignPreview } from './BannerDesignPreview';
import { LockDetails } from './LockDetails';

const Container = styled('header')(({ theme }) => ({
  display: 'flex',
  alignItems: 'flex-start',
  justifyContent: 'space-between',
  paddingLeft: theme.spacing(3),
  paddingRight: theme.spacing(3),
  paddingBottom: theme.spacing(2),
  paddingTop: theme.spacing(1),
  backgroundColor: theme.palette.grey[200],
  borderBottom: `1px solid ${theme.palette.grey[500]}`,
}));

const NamesContainer = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'spaced',
  height: '100%',
});

const MainHeader = styled(Typography)({
  fontSize: '32px',
  fontWeight: 'normal',
});

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

const ButtonText = styled(Typography)(({ theme }) => ({
  fontSize: '14px',
  fontWeight: 500,
  textTransform: 'uppercase',
  letterSpacing: '1px',
  color: theme.palette.grey[800],
}));

const StyledEditIcon = styled(EditIcon)({ color: grey[700] });
const StyledLockIcon = styled(LockIcon)({ color: grey[700] });
const StyledCloseIcon = styled(CloseIcon)({ color: grey[700] });
const StyledSaveIcon = styled(SaveIcon)({ color: grey[700] });

interface Props {
  name: string;
  design: BannerDesign;
  onLock: (name: string, force: boolean) => void;
  onUnlock: (name: string) => void;
  onSave: (name: string) => void;
  onArchive: (designName: string) => void;
  lockStatus: LockStatus;
  userHasLock: boolean;
  onStatusChange: (status: Status) => void;
}

interface ArchiveButtonProps {
  design: BannerDesign;
  name: string;
  onArchive: (designName: string) => void;
}

const ArchiveButton: React.FC<ArchiveButtonProps> = ({ design, name, onArchive }) => {
  const [isOpen, open, close] = useOpenable();

  return (
    <Tooltip
      title={design.status !== 'Draft' ? 'Design must be in draft status before archiving' : ''}
    >
      <span>
        <Button
          variant="outlined"
          startIcon={<ArchiveIcon style={{ color: grey[700] }} />}
          size="medium"
          onClick={open}
          disabled={design.status !== 'Draft'}
        >
          <ButtonText>Archive banner design</ButtonText>
        </Button>
        <Dialog
          open={isOpen}
          onClose={close}
          aria-labelledby="archive-dialog-title"
          aria-describedby="archive-dialog-description"
        >
          <DialogTitle id="archive-dialog-title">Are you sure?</DialogTitle>
          <DialogContent>
            <DialogContentText id="archive-dialog-description">
              Archiving this design will remove it from the banner design tool - you can only
              restore with an engineer&apos;s help.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button color="primary" onClick={close}>
              Cancel
            </Button>
            <Button color="primary" onClick={() => onArchive(name)}>
              Archive design
            </Button>
          </DialogActions>
        </Dialog>
      </span>
    </Tooltip>
  );
};

const StickyTopBar: React.FC<Props> = ({
  name,
  design,
  onLock,
  onUnlock,
  onSave,
  onArchive,
  userHasLock,
  lockStatus,
  onStatusChange,
}: Props) => {
  return (
    <Container>
      <NamesContainer>
        <MainHeader variant="h2">{name}</MainHeader>
      </NamesContainer>
      <ButtonsContainer>
        <SwitchContainer>
          <LiveSwitch
            label="Status"
            isLive={design.status === 'Live'}
            onChange={(isLive: boolean) => onStatusChange(isLive ? 'Live' : 'Draft')}
            isDisabled={userHasLock && lockStatus.locked}
          />
        </SwitchContainer>
        <LockContainer>
          {!userHasLock && !lockStatus.locked && (
            <>
              <Button
                variant="outlined"
                size="medium"
                startIcon={<StyledEditIcon />}
                onClick={() => onLock(name, false)}
              >
                <ButtonText>Edit design</ButtonText>
              </Button>
            </>
          )}
          {!userHasLock && lockStatus.locked && (
            <>
              <LockDetails email={lockStatus.email} timestamp={lockStatus.timestamp} />
              <Button
                variant="outlined"
                size="medium"
                startIcon={<StyledLockIcon />}
                onClick={() => onLock(name, true)}
              >
                <ButtonText>Take control</ButtonText>
              </Button>
            </>
          )}
          {userHasLock && (
            <>
              <ArchiveButton design={design} name={name} onArchive={onArchive} />
              <Button
                variant="outlined"
                size="medium"
                startIcon={<StyledCloseIcon />}
                onClick={() => onUnlock(name)}
              >
                <ButtonText>Discard</ButtonText>
              </Button>
              <Button
                variant="outlined"
                size="medium"
                startIcon={<StyledSaveIcon />}
                onClick={() => onSave(name)}
              >
                <ButtonText>Save</ButtonText>
              </Button>
            </>
          )}
          <BannerDesignPreview design={design} />
        </LockContainer>
      </ButtonsContainer>
    </Container>
  );
};

export default StickyTopBar;
