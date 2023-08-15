import React, { useState } from 'react';
import StickyTopBar from './StickyTopBar';
import { makeStyles, Theme } from '@material-ui/core';
import { LockStatus } from '../helpers/shared';
import useValidation from '../hooks/useValidation';
import BannerDesignForm from './BannerDesignForm';
import { BannerDesign } from '../../../models/BannerDesign';

const useStyles = makeStyles(({ palette }: Theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    width: '100%',
    background: palette.background.paper,
    borderLeft: `1px solid ${palette.grey[500]}`,
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
      />
      <BannerDesignForm
        design={design}
        setValidationStatus={setValidationStatus}
        isDisabled={!userHasLock}
        onChange={onChange}
      />
    </div>
  );
};

export default BannerDesignEditor;
