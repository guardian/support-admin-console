import { makeStyles } from '@mui/styles';
import { Button, Dialog, Theme, Typography } from '@mui/material';
import React, { useEffect } from 'react';
import useOpenable from '../../hooks/useOpenable';
import { format } from 'date-fns';
import { LineChart, CartesianGrid, Line, XAxis, YAxis, Legend, Tooltip } from 'recharts';

const useStyles = makeStyles(({}: Theme) => ({
  dialog: {
    padding: '10px',
  },
  heading: {
    margin: '6px 12px 0 12px',
    fontSize: 18,
    fontWeight: 500,
  },
  chartContainer: {
    margin: '12px',
  },
}));

interface VariantSummary {
  variantName: string;
  mean: number;
  views: number;
}
interface VariantSample {
  variantName: string;
  views: number;
  mean: number;
}
interface TestSample {
  timestamp: string;
  variants: VariantSample[];
}
interface BanditData {
  variantSummaries: VariantSummary[];
  samples: TestSample[];
}

interface SamplesChartProps {
  data: BanditData;
  variantNames: string[];
  fieldName: keyof VariantSample;
}

const Colours = ['red', 'blue', 'green', 'orange', 'yellow'];

type ChartDataPoint = Record<string, string | number>;

const SamplesChart = ({ data, variantNames, fieldName }: SamplesChartProps) => {
  const chartData = data.samples
    .map(({ timestamp, variants }) => {
      if (variants.length > 0) {
        const sample: ChartDataPoint = {
          dateHour: format(Date.parse(timestamp), 'yyyy-MM-dd hh:mm'),
        };
        variants.forEach(variant => {
          sample[variant.variantName] = variant[fieldName];
        });
        return sample;
      }
      return undefined;
    })
    .filter(sample => !!sample);

  return (
    <LineChart width={800} height={500} data={chartData}>
      <XAxis dataKey="dateHour" />
      <YAxis />
      <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
      <Legend />
      <Tooltip />
      {variantNames.map((name, idx) => (
        <Line key={name} type="monotone" dataKey={name} stroke={Colours[idx]} />
      ))}
    </LineChart>
  );
};

interface BanditAnalyticsButton {
  testName: string;
  channel: string;
}

export const BanditAnalyticsButton: React.FC<BanditAnalyticsButton> = ({
  testName,
  channel,
}: BanditAnalyticsButton) => {
  const classes = useStyles();
  const [isOpen, open, close] = useOpenable();
  const [data, setData] = React.useState<BanditData>();
  const [loading, setLoading] = React.useState<boolean>(false);

  useEffect(() => {
    setLoading(true);

    fetch(`/frontend/bandit/${channel}/${testName}`)
      .then(resp => resp.json())
      .then(data => {
        setData(data);
        setLoading(false);
      });
  }, [testName, channel]);

  const variantNames = data?.variantSummaries.map(variant => variant.variantName) ?? [];

  return (
    <>
      <Button variant="outlined" onClick={open}>
        Analytics
      </Button>

      <Dialog open={isOpen} onClose={close} fullWidth maxWidth="lg" className={classes.dialog}>
        <div className={classes.heading}>
          <h3>Bandit data for: {testName}</h3>
        </div>

        <div className={classes.chartContainer}>
          {loading && <Typography>Loading...</Typography>}
          {data && (
            <div>
              <h2>Impressions</h2>
              <SamplesChart data={data} variantNames={variantNames} fieldName={'views'} />

              <h2>Scores</h2>
              <SamplesChart data={data} variantNames={variantNames} fieldName={'mean'} />

              <h2>Total impressions:</h2>
              {data.variantSummaries
                .sort((va, vb) => vb.views - va.views)
                .map(({ variantName, views }) => (
                  <div key={variantName}>
                    <Typography>
                      {variantName}: {views}
                    </Typography>
                  </div>
                ))}
            </div>
          )}
        </div>
      </Dialog>
    </>
  );
};
