import { makeStyles } from '@mui/styles';
import {Button, Dialog, Theme, Typography} from "@mui/material";
import React, {useEffect} from 'react';
import useOpenable from '../../hooks/useOpenable';
import { formatISO9075, subHours} from "date-fns";
import {LineChart, CartesianGrid, Line, XAxis, YAxis, Legend} from 'recharts';
import {Test} from "./helpers/shared";

const useStyles = makeStyles(({}: Theme) => ({
  dialog: {
    padding: '10px',
  },
  heading: {
    margin: '12px',
    fontSize: 16,
  },
  variantName: {
    fontSize: 18,
    fontWeight: 500,
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

  const { name: testName, variants } = test;

  useEffect(() => {
    const now = new Date();
    const from = subHours(now, 24);

    fetch(
      `/frontend/analytics/${channel}/${testName}?from=${formatISO9075(from)}&to=${formatISO9075(
        now,
      )}`,
    )
      .then(resp => resp.json())
      .then(setData);
  }, [testName, channel]);

  return (
    <>
      <Button variant="outlined" onClick={open}>
        Analytics
      </Button>

      <Dialog open={isOpen} onClose={close} fullWidth maxWidth="xl" className={classes.dialog}>
        <div className={classes.heading}>
          <h3 className={classes.variantName}>{testName}</h3>
          <h3>Impressions per hour:</h3>
        </div>

        {data && <Chart data={data} variantNames={variants.map(v => v.name)} />}
        {!data && <Typography>Loading...</Typography>}
      </Dialog>
    </>
  );
};
