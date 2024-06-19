import { makeStyles } from '@mui/styles';
import {
  Button,
  Dialog,
  FormControlLabel,
  Radio,
  RadioGroup,
  Theme,
  Typography,
} from '@mui/material';
import React, { useEffect } from 'react';
import useOpenable from '../../hooks/useOpenable';
import { formatISO9075, subDays, subHours } from 'date-fns';
import { LineChart, CartesianGrid, Line, XAxis, YAxis, Legend } from 'recharts';
import { Test } from './helpers/shared';

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

type Channel =
  | 'Epic'
  | 'EpicAMP'
  | 'EpicAppleNews'
  | 'EpicLiveblog'
  | 'Banner1'
  | 'Banner2'
  | 'Header';

interface GroupedVariantViews {
  dateHour: string;
  views: {
    [variantName: string]: number;
  };
}

interface ChartProps {
  data: GroupedVariantViews[];
  variantNames: string[];
}

const Colours = ['red', 'blue', 'green', 'orange', 'yellow'];

const Chart = ({ data, variantNames }: ChartProps) => {
  const flattenedData = data.map(({ dateHour, views }) => ({
    dateHour: dateHour,
    ...views,
  }));

  return (
    <LineChart width={800} height={500} data={flattenedData}>
      <XAxis dataKey="dateHour" />
      <YAxis />
      <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
      <Legend />
      {variantNames.map((name, idx) => (
        <Line key={name} type="monotone" dataKey={name} stroke={Colours[idx]} />
      ))}
    </LineChart>
  );
};

const buildTotals = (data: GroupedVariantViews[]): { [variantName: string]: number } => {
  const totals: { [variantName: string]: number } = {};
  data.forEach((viewsForHour: GroupedVariantViews) => {
    Object.entries(viewsForHour.views).forEach(([variantName, count]) => {
      totals[variantName] = (totals[variantName] || 0) + count;
    });
  });
  return totals;
};

type Range = '24Hours' | 'week';

interface AnalyticsButtonProps {
  test: Test;
  channel: Channel;
}

export const AnalyticsButton: React.FC<AnalyticsButtonProps> = ({
  test,
  channel,
}: AnalyticsButtonProps) => {
  const classes = useStyles();
  const [isOpen, open, close] = useOpenable();
  const [data, setData] = React.useState<GroupedVariantViews[]>();
  const [range, setRange] = React.useState<Range>('24Hours');
  const [loading, setLoading] = React.useState<boolean>(false);

  const { name: testName, variants } = test;

  useEffect(() => {
    setLoading(true);
    const now = new Date();
    const from = range === '24Hours' ? subHours(now, 24) : subDays(now, 7);

    fetch(
      `/frontend/analytics/${channel}/${testName}?from=${formatISO9075(from)}&to=${formatISO9075(
        now,
      )}`,
    )
      .then(resp => resp.json())
      .then(data => {
        setData(data);
        setLoading(false);
      });
  }, [testName, channel, range]);

  return (
    <>
      <Button variant="outlined" onClick={open}>
        Analytics
      </Button>

      <Dialog open={isOpen} onClose={close} fullWidth maxWidth="lg" className={classes.dialog}>
        <div className={classes.heading}>
          <h3>Impressions for: {testName}</h3>
        </div>

        <div className={classes.chartContainer}>
          <RadioGroup value={range} onChange={event => setRange(event.target.value as Range)}>
            <FormControlLabel
              value="24Hours"
              key="24Hours"
              control={<Radio />}
              label="Last 24 hours"
            />
            <FormControlLabel value="week" key="week" control={<Radio />} label="Last week" />
          </RadioGroup>
          {loading && <Typography>Loading...</Typography>}
          {data && (
            <div>
              <Chart data={data} variantNames={variants.map(v => v.name)} />
              <div>
                <h2>Total impressions:</h2>
                {Object.entries(buildTotals(data)).map(([variantName, count]) => (
                  <div key={variantName}>
                    <Typography>
                      {variantName}: {count}
                    </Typography>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </Dialog>
    </>
  );
};
