import { styled } from '@mui/material/styles';
import React, { useState } from 'react';
import { BannerDesign, Status } from '../../../models/bannerDesign';
import { LockStatus } from '../helpers/shared';
import useValidation from '../hooks/useValidation';
import BannerDesignForm from './BannerDesignForm';
import StickyTopBar from './StickyTopBar';

const Container = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  width: '100%',
  background: theme.palette.background.paper,
  borderLeft: `1px solid ${theme.palette.grey[500]}`,
}));

const ScrollableContainer = styled('div')(({ theme }) => ({
  overflowY: 'auto',
  paddingLeft: theme.spacing(3),
  paddingRight: theme.spacing(1),
  paddingTop: theme.spacing(2),
}));

type Props = {
  name: string;
  design: BannerDesign;
  onLock: (designName: string, force: boolean) => void;
  onUnlock: (designName: string) => void;
  onSave: (designName: string) => void;
  onArchive: (designName: string) => void;
  userHasLock: boolean;
  lockStatus: LockStatus;
  onChange: (design: BannerDesign) => void;
  onStatusChange: (status: Status) => void;
};

const BannerDesignEditor: React.FC<Props> = ({
  design,
  name,
  onLock,
  onUnlock,
  onSave,
  onArchive,
  userHasLock,
  lockStatus,
  onChange,
  onStatusChange,
}: Props) => {
  const [isValid, setIsValid] = useState<boolean>(true);

  const setValidationStatus = useValidation(setIsValid);

  const onSaveWithValidation = (designName: string): void => {
    if (isValid) {
      onSave(designName);
    } else {
      alert('Form contains errors. Please fix any errors before saving.');
    }
  };

  return (
    <Container>
      <StickyTopBar
        name={name}
        onLock={onLock}
        onUnlock={onUnlock}
        onSave={onSaveWithValidation}
        onArchive={onArchive}
        userHasLock={userHasLock}
        lockStatus={lockStatus}
        design={design}
        onStatusChange={onStatusChange}
      />
      <ScrollableContainer>
        <BannerDesignForm
          design={design}
          setValidationStatus={setValidationStatus}
          isDisabled={!userHasLock}
          onChange={onChange}
        />
      </ScrollableContainer>
    </Container>
  );
};

export default BannerDesignEditor;
