import React from 'react';
import { useEffect, useState } from 'react';
import { addHours, subHours, formatISO9075 } from 'date-fns';
import { Dialog, DialogContent, DialogTitle, IconButton, Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { SuperModeRow } from './useSuperModeRows';
import CloseIcon from '@mui/icons-material/Close';
import { ArticleDetails } from './articleDetails';
import { BarChart, Bar, CartesianGrid, XAxis, YAxis } from 'recharts';

interface ArticleEpicData {
  views: number;
  conversions: number;
  avGBP: number;
  hour: number;
}

const useStyles = makeStyles(() => ({
  chartLabel: {
    fontSize: 14,
    fontWeight: 500,
  },
  dialogHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingRight: '8px',
  },
  note: {
    fontStyle: 'italic',
    marginBottom: '8px',
    fontSize: 16,
  },
}));

const LOOK_BACK_HOURS = 12;

interface BarChartProps {
  data: ArticleEpicData[];
  yValue: (data: ArticleEpicData) => number;
  label: string;
}
const CustomBarChart = ({ data, yValue, label }: BarChartProps) => {
  const classes = useStyles();
  return (
    <>
      <Typography variant={'h3'} className={classes.chartLabel}>
        {label}/hour
      </Typography>

      <BarChart
        width={600}
        height={300}
        data={data.map(item => ({
          x: item.hour.toString().padStart(2, '0'),
          y: yValue(item),
        }))}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="x" />
        <YAxis />
        <Bar dataKey="y" fill="#8884d8" />
      </BarChart>
    </>
  );
};

interface ArticleDataChartsProps {
  url: string;
  start: Date;
}
const ArticleDataCharts: React.FC<ArticleDataChartsProps> = ({
  url,
  start,
}: ArticleDataChartsProps) => {
  const classes = useStyles();
  const [data, setData] = useState<ArticleEpicData[]>([]);

  const from = subHours(start, LOOK_BACK_HOURS);
  const to = addHours(start, 24);

  useEffect(() => {
    fetch(
      `/frontend/epic-article-data?url=${url}&from=${formatISO9075(from)}&to=${formatISO9075(to)}`,
    )
      .then(resp => resp.json())
      .then(setData);
  }, []);

  if (data.length > 0) {
    return (
      <div>
        <Typography variant={'h3'} className={classes.note}>
          This data is for all regions
        </Typography>

        <CustomBarChart data={data} yValue={item => item.views} label="Epic views" />

        <CustomBarChart data={data} yValue={item => item.conversions} label="Conversions" />

        <CustomBarChart data={data} yValue={item => item.avGBP} label="£AV" />
      </div>
    );
  }

  return <div>Querying...</div>;
};

interface ArticleDataChartDialogProps {
  row: SuperModeRow | null;
  onClose: () => void;
}
export const ArticleDataChartDialog: React.FC<ArticleDataChartDialogProps> = ({
  row,
  onClose,
}: ArticleDataChartDialogProps) => {
  const classes = useStyles();

  return (
    <Dialog open={!!row} onClose={onClose} maxWidth={'lg'}>
      {row && (
        <>
          <div className={classes.dialogHeader}>
            <DialogTitle>
              <ArticleDetails
                url={row.url.replace('https://www.theguardian.com/', '')}
                startTimestamp={row.startTimestamp}
                region={row.region}
              />
            </DialogTitle>
            <IconButton onClick={onClose} aria-label="close">
              <CloseIcon />
            </IconButton>
          </div>
          <DialogContent>
            <ArticleDataCharts url={row.url} start={new Date(Date.parse(row.startTimestamp))} />
          </DialogContent>
        </>
      )}
    </Dialog>
  );
};
