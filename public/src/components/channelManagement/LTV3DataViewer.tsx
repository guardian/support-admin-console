import React, { useEffect } from 'react';
import { TextField } from '@mui/material';

interface LTV3Data {
  testName: string;
  ltv3Data: number;
}

interface LTV3DataViewer {
  testName: string;
  channel: string;
  label?: string;
  disabled: boolean;
}

export const LTV3DataViewer: React.FC<LTV3DataViewer> = ({
  testName,
  channel,
  disabled,
}: LTV3DataViewer) => {
  const [data, setData] = React.useState<LTV3Data>();
  useEffect(() => {
    fetch(`/frontend/bandit/${channel}/${testName}/ltv3`)
      .then(resp => resp.json())
      .then(data => {
        setData(data);
      });
  }, [testName, channel]);

  return (
    <>
      <div>
        <TextField
          type={'number'}
          InputProps={{ inputProps: { min: 0.1, max: 1, step: 0.1 } }}
          value={data?.ltv3Data ?? 0}
          label={'LTV3'}
          disabled={disabled}
        />
      </div>
    </>
  );
};
