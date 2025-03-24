import React, { useEffect } from 'react';
import { Typography } from '@mui/material';

interface LTV3Data {
  testName: string;
  variant_name: string;
  component_type: string;
  ltv3: number;
}

interface LTV3DataViewerProps {
  testName: string;
  channel: string;
  label?: string;
}

const calculateTotalLTV3 = (testData: LTV3Data[]): number => {
  return testData.reduce((sum, item) => sum + item.ltv3, 0);
};

export const LTV3DataViewer: React.FC<LTV3DataViewerProps> = ({
  testName,
  channel,
  label,
}: LTV3DataViewerProps) => {
  const [data, setData] = React.useState<LTV3Data[]>();
  useEffect(() => {
    fetch(`/frontend/bandit/${channel}/${testName}/ltv3`)
      .then(resp => resp.json())
      .then(data => {
        setData(data);
      });
  }, [testName, channel]);

  const ltv3Total = data ? calculateTotalLTV3(data).toFixed(2) : 0;
  return (
    <>
      <div>
        <Typography variant="body1">{label}</Typography>
        <h5>{ltv3Total}</h5>
      </div>
    </>
  );
};
