import { makeStyles } from '@mui/styles';
import {Button, Dialog, Theme, Typography} from "@mui/material";
import React, {useEffect} from 'react';
import useOpenable from '../../hooks/useOpenable';
import {addHours, formatISO9075, subHours} from "date-fns";
import { LineChart, CartesianGrid, Line, XAxis, YAxis } from 'recharts';
import {Test} from "./helpers/shared";

const useStyles = makeStyles(({}: Theme) => ({
  dialog: {
    padding: '10px',
  },
  variantName: {
    marginBottom: '10px',
    fontSize: 26,
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

type FlattenedGroupVariantViews = {
  dateHour: string;
} & { [variantName: string]: number };

const Chart = ({ data, variantNames }: ChartProps) => {
  const flattenedData = data.map(({ dateHour, views }) => ({
    dateHour: dateHour,
    ...views,
  }));
  console.log({ flattenedData })
  return (
    <LineChart width={500} height={300} data={flattenedData}>
      <XAxis dataKey="dateHour" />
      <YAxis />
      <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
      {variantNames.map(name => (
        <Line key={name} type="monotone" dataKey={name} stroke="#8884d8" />
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

  console.log(data);

  return (
    <>
      <Button variant="outlined" onClick={open}>
        Analytics
      </Button>

      <Dialog open={isOpen} onClose={close} fullWidth maxWidth="xl" className={classes.dialog}>
        <h1>{testName}</h1>

        {data && <Chart data={data} variantNames={variants.map(v => v.name)} />}
      </Dialog>
    </>
  );
};
