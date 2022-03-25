import React from 'react';

import {FormControlLabel, FormGroup, Radio, RadioGroup} from '@material-ui/core';
import { DeviceType } from './helpers/shared';

interface DeviceTypeRadioProps {
  deviceType: DeviceType;
  isDisabled: boolean;
  onChange: (updatedDeviceType: DeviceType) => void;
}
const DeviceTypeRadio: React.FC<DeviceTypeRadioProps> = ({
  deviceType,
  onChange,
  isDisabled,
}) => <FormControlLabel
  value={deviceType}
  key={deviceType}
  control={<Radio />}
  label={deviceType}
  disabled={isDisabled}
  onChange={() => onChange(deviceType)}
/>;

interface TestEditorTargetDeviceTypeProps {
  selectedDeviceType: DeviceType;
  onChange: (updatedDeviceType: DeviceType) => void;
  isDisabled: boolean;
}
const TestEditorTargetDeviceType: React.FC<TestEditorTargetDeviceTypeProps> = ({
  selectedDeviceType,
  onChange,
  isDisabled,
}: TestEditorTargetDeviceTypeProps) =>
    <FormGroup>
      <RadioGroup value={selectedDeviceType}>
        <DeviceTypeRadio deviceType={'All'} isDisabled={isDisabled} onChange={onChange}/>
        <DeviceTypeRadio deviceType={'Desktop'} isDisabled={isDisabled} onChange={onChange}/>
        <DeviceTypeRadio deviceType={'Mobile'} isDisabled={isDisabled} onChange={onChange}/>
      </RadioGroup>
    </FormGroup>;

export default TestEditorTargetDeviceType;
