import React, { useEffect } from 'react';

interface LTV3Data {
  testName: string;
  ltv3Data: number;
}

interface LTV3DataViewer {
  testName: string;
  channel: string;
  label?: string;
}

export const LTV3DataViewer: React.FC<LTV3DataViewer> = ({ testName, channel }: LTV3DataViewer) => {
  const [data, setData] = React.useState<LTV3Data>();
  const [loading, setLoading] = React.useState<boolean>(false);

  useEffect(() => {
    setLoading(true);
    fetch(`/frontend/bandit/${channel}/${testName}/ltv3`)
      .then(resp => resp.json())
      .then(data => {
        setData(data);
        setLoading(false);
      });
  }, [testName, channel]);

  return (
    <>
      <div>
        <h2>LTV3 Data</h2>
        {loading && <p>Loading...</p>}
        {data && <p>{data.ltv3Data}</p>}
      </div>
    </>
  );
};
