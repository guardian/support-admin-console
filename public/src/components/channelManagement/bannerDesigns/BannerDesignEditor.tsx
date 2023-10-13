import React, { useState } from 'react';
import StickyTopBar from './StickyTopBar';
import { makeStyles, Theme } from '@material-ui/core';
import { LockStatus } from '../helpers/shared';
import useValidation from '../hooks/useValidation';
import BannerDesignForm from './BannerDesignForm';
import { BannerDesign, Status } from '../../../models/bannerDesign';

const useStyles = makeStyles(({ spacing, palette }: Theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    width: '100%',
    background: palette.background.paper,
    borderLeft: `1px solid ${palette.grey[500]}`,
  },
  scrollableContainer: {
    overflowY: 'auto',
    paddingLeft: spacing(3),
    paddingRight: spacing(1),
    paddingTop: spacing(2),
  },
}));

type Props = {
  name: string;
  design: BannerDesign;
  onLock: (designName: string, force: boolean) => void;
  onUnlock: (designName: string) => void;
  onSave: (designName: string) => void;
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
  userHasLock,
  lockStatus,
  onChange,
  onStatusChange,
}: Props) => {
  const classes = useStyles();

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
    <div className={classes.container}>
      <StickyTopBar
        name={name}
        onLock={onLock}
        onUnlock={onUnlock}
        onSave={onSaveWithValidation}
        userHasLock={userHasLock}
        lockStatus={lockStatus}
        design={design}
        onStatusChange={onStatusChange}
      />
      <div className={classes.scrollableContainer}>
        <BannerDesignForm
          design={design}
          setValidationStatus={setValidationStatus}
          isDisabled={!userHasLock}
          onChange={onChange}
        />
      </div>
    </div>
  );
};

export default BannerDesignEditor;
