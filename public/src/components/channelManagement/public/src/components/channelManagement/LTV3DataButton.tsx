import React from 'react';
import { Button, Dialog, Theme } from '@mui/material';
import { makeStyles } from '@mui/styles';
import useOpenable from '../../../../../../hooks/useOpenable';
import { Methodology } from '../../../../helpers/shared';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

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
  totalContainer: {
    fontSize: 15,
    fontWeight: 500,
  },
}));

export interface LTV3Data {
  test_name: string;
  variant_name: string;
  component_type: string;
  ltv3: number;
}

interface LTV3DataButtonProps {
  testName: string;
  channel: string;
  label?: string;
  methodologies: Methodology[];
}

export const LTV3DataButton: React.FC<LTV3DataButtonProps> = ({
  testName,
  channel,
  label,
  methodologies,
}: LTV3DataButtonProps) => {
  const classes = useStyles();
  const [isOpen, open, close] = useOpenable();

  const [dataSet, setDataSet] = React.useState<LTV3Data[][]>([]);
  const testNamesForLTV3Data = methodologies.map((methodology) =>
    methodology.testName === undefined ? testName : methodology.testName,
  );

  const handleClick = () => {
    open();
    const fetchData = async () => {
      const promises = testNamesForLTV3Data?.map(async (testName) => {
        const response = await fetch(`frontend/bandit/${channel}/${testName}/ltv3`);
        const data = (await response.json()) as LTV3Data[];
        return data;
      });

      const allResults = await Promise.all(promises);
      setDataSet(allResults);
    };
    fetchData().then(() => console.log('LTV3 Data fetched successfully'));
  };

  const uniqueVariantNames = [...new Set(dataSet.flat().map((item) => item.variant_name))];
  const uniqueTestNames = [...new Set(dataSet.flat().map((item) => item.test_name))];
  return (
    <>
      <div>
        <Button className={classes.button} variant="outlined" onClick={handleClick}>
          {label}
        </Button>
        <Dialog open={isOpen} onClose={close} maxWidth="lg" className={classes.dialog}>
          <div className={classes.heading}>
            <h3>LTV3 data for the test : {testName}</h3>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Variants</TableCell>
                    {uniqueTestNames.map((testName) => (
                      <TableCell key={testName}>{testName}</TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {uniqueVariantNames?.map((row) => (
                    <TableRow key={row}>
                      <TableCell>{row}</TableCell>
                      {uniqueTestNames.map((testName) => {
                        const ltv3Value =
                          dataSet
                            .flat()
                            .find(
                              (item) => item.variant_name === row && item.test_name === testName,
                            )?.ltv3 ?? 0;
                        return <TableCell key={testName}>{ltv3Value.toFixed(2)}</TableCell>;
                      })}
                    </TableRow>
                  ))}
                  <TableRow>
                    <TableCell className={classes.totalContainer}>Total</TableCell>
                    {uniqueTestNames.map((testName) => {
                      const totalLTV3 = dataSet
                        .flat()
                        .filter((item) => item.test_name === testName)
                        .reduce((sum, item) => sum + item.ltv3, 0);
                      return (
                        <TableCell className={classes.totalContainer} key={testName}>
                          {totalLTV3.toFixed(2)}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        </Dialog>
      </div>
    </>
  );
};
