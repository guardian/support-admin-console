import React, { useEffect } from 'react';
import { Button, Dialog, Theme } from '@mui/material';
import { makeStyles } from '@mui/styles';
import useOpenable from '../../../../../../hooks/useOpenable';
import { Methodology, Variant } from '../../../../helpers/shared';

const useStyles = makeStyles(({}: Theme) => ({
  button: {
    height: '100%',
  },
  dialog: {
    padding: '10px',
  },
  heading: {
    margin: '6px 12px 0 12px',
    fontSize: 18,
    fontWeight: 500,
  },
  container: {
    width: '100%',
  },
  sectionContainer: {
    display: 'flex',
  },
}));

interface LTV3Data {
  testName: string;
  variant_name: string;
  component_type: string;
  ltv3: number;
}

interface LTV3DataButtonProps {
  testName: string;
  variants: Variant[];
  channel: string;
  label?: string;
  methodologies: Methodology[];
}

export const LTV3DataButton: React.FC<LTV3DataButtonProps> = ({
  testName,
  variants,
  channel,
  label,
  methodologies,
}: LTV3DataButtonProps) => {
  const classes = useStyles();

  console.log('Test name: ', testName);
  console.log(
    'Methodologies Name: ',
    methodologies.map(methodology => methodology.name),
  );
  console.log(
    'Methodologies Test Name exists: ',
    methodologies.map(methodology => methodology.testName),
  );
  console.log(
    'Variant Names: ',
    variants.map(variant => variant.name),
  );
  console.log(
    'Methodologies: ',
    methodologies.map(methodology => methodology.testName),
  );
  console.log('Methodologies Old: ', methodologies);
  console.log('Methodologies Length: ', methodologies.length);

  console.log(
    'Print Method',
    methodologies?.map(methodology =>
      methodology?.testName === undefined ? 'No test name' : 'Has test name',
    ),
  );

  const [isOpen, open, close] = useOpenable();

  const [dataSet, setDataSet] = React.useState<LTV3Data[][]>([]);
  const testNamesForLTV3Data = methodologies.map(methodology =>
    methodology.testName === undefined ? testName : methodology.testName,
  );
  useEffect(() => {
    const fetchData = async () => {
      const promises = testNamesForLTV3Data?.map(async testName => {
        const response = await fetch(`frontend/bandit/${channel}/${testName}/ltv3`);
        const data = (await response.json()) as LTV3Data[];
        return data;
      });

      const allResults = await Promise.all(promises);
      setDataSet(allResults);
    };
    fetchData().then(r => console.log('Data fetched: ', r));
  }, [testNamesForLTV3Data, channel]);

  console.log('DataSet: ', dataSet);
  return (
    <>
      <div>
        <Button className={classes.button} variant="outlined" onClick={open}>
          {label}
        </Button>
        <Dialog open={isOpen} onClose={close} maxWidth="lg" className={classes.dialog}>
          <div className={classes.heading}>
            <h3>LTV3 data for the test : {testName}</h3>
            <h3>{dataSet}</h3>
          </div>
        </Dialog>
      </div>
    </>
  );
};
