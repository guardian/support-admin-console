import React from 'react';

import { Checkbox, FormControlLabel, FormGroup, Theme, makeStyles } from '@material-ui/core';
import { DeviceType } from './helpers/shared';

const useStyles = makeStyles(({ spacing }: Theme) => ({
  indentedContainer: {
    marginLeft: spacing(3),
  },
}));

interface TestEditorTargetDeviceTypeProps {
  selectedDeviceType: DeviceType;
  onChange: (updatedDeviceType: DeviceType) => void;
  isDisabled: boolean;
}
const TestEditorTargetDeviceType: React.FC<TestEditorTargetDeviceTypeProps> = ({
  selectedDeviceType,
  onChange,
  isDisabled,
}: TestEditorTargetDeviceTypeProps) => {
  const classes = useStyles();

  const onSelect = (deviceType: DeviceType) => (
    event: React.ChangeEvent<HTMLInputElement>,
  ): void => {
    if (event.target.checked) {
      // It's impossible to have had neither checked, so it must now be both
      onChange('All');
    } else if (selectedDeviceType === 'All') {
      if (deviceType === 'Desktop') {
        onChange('Mobile');
      } else if (deviceType === 'Mobile') {
        onChange('Desktop');
      }
    }
  };

  return (
    <FormGroup>
      <FormControlLabel
        control={
          <Checkbox
            checked={selectedDeviceType === 'All'}
            onChange={onSelect('All')}
            disabled={isDisabled}
          />
        }
        label="Everyone"
      />
      <FormGroup className={classes.indentedContainer}>
        <FormControlLabel
          control={
            <Checkbox
              checked={selectedDeviceType === 'All' || selectedDeviceType === 'Desktop'}
              onChange={onSelect('Desktop')}
              disabled={isDisabled}
            />
          }
          label="Desktop"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={selectedDeviceType === 'All' || selectedDeviceType === 'Mobile'}
              onChange={onSelect('Mobile')}
              disabled={isDisabled}
            />
          }
          label="Mobile"
        />
      </FormGroup>
    </FormGroup>
  );
};

export default TestEditorTargetDeviceType;
