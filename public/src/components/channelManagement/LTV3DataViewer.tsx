import React, { useEffect } from 'react';
import { TextField } from '@mui/material';

interface LTV3Data {
  testName: string;
  variant_name: string;
  component_type: string;
  ltv3: number;
}

interface LTV3DataViewer {
  testName: string;
  channel: string;
  label?: string;
  disabled: boolean;
}

const calculateTotalLTV3 = (testData: LTV3Data[]): number => {
  return testData.reduce((sum, item) => sum + item.ltv3, 0);
};

export const LTV3DataViewer: React.FC<LTV3DataViewer> = ({
  testName,
  channel,
  disabled,
}: LTV3DataViewer) => {
  const [data, setData] = React.useState<LTV3Data[]>();
  useEffect(() => {
    fetch(`/frontend/bandit/${channel}/${testName}/ltv3`)
      .then(resp => resp.json())
      .then(data => {
        setData(data);
      });
  }, [testName, channel]);

  const ltv3Total = data ? calculateTotalLTV3(data) : 0;
  return (
    <>
      <div>
        <TextField type={'number'} value={ltv3Total} label={'LTV3'} disabled={disabled} fullWidth />
      </div>
    </>
  );
};
