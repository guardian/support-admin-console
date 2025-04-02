import React, { useEffect } from 'react';
import { Button, Dialog, Theme } from '@mui/material';
import { makeStyles } from '@mui/styles';
import useOpenable from '../../../../../../hooks/useOpenable';
import { Methodology, Variant } from '../../../../helpers/shared';
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
  methodologies?: Methodology[];
}

export const LTV3DataButton: React.FC<LTV3DataButtonProps> = ({
  testName,
  variants,
  channel,
  label,
  methodologies,
}: LTV3DataButtonProps) => {
  const classes = useStyles();
  // const [data, setData] = React.useState<LTV3Data[]>();
  const [isOpen, open, close] = useOpenable();
  // useEffect(() => {
  //   fetch(`/frontend/bandit/${channel}/${testName}/ltv3`)
  //     .then(resp => resp.json())
  //     .then(data => {
  //       setData(data);
  //     });
  // }, [testName, channel]);
  const variantNames = variants.map(variant => variant.name);

  // const data1 = [
  //   {
  //     test_name: '2025-02-18_GERMANY_EPIC_ROUND2_Roulette',
  //     variant_name: 'V1_GERMANY',
  //     component_type: 'ACQUISITIONS_EPIC',
  //     ltv3: 55.7754639,
  //   },
  //   {
  //     test_name: '2025-02-18_GERMANY_EPIC_ROUND2_Roulette',
  //     variant_name: 'V2_SUPPORTER_PLUS_HIGHLIGHTED_TEXT',
  //     component_type: 'ACQUISITIONS_EPIC',
  //     ltv3: 7011.856387087999,
  //   },
  //   {
  //     test_name: '2025-02-18_GERMANY_EPIC_ROUND2_Roulette',
  //     variant_name: 'CONTROL',
  //     component_type: 'ACQUISITIONS_EPIC',
  //     ltv3: 1144.953366992,
  //   },
  // ];

  console.log('Variant Names: ', variantNames);
  console.log(
    'Methodologies: ',
    methodologies?.map(methodology => methodology?.testName),
  );
  return (
    <>
      <div>
        <Button className={classes.button} variant="outlined" onClick={open}>
          {label}
        </Button>
        <Dialog open={isOpen} onClose={close} maxWidth="lg" className={classes.dialog}>
          <div className={classes.heading}>
            <h3>LTV3 data for the test : {testName}</h3>
          </div>
          <div className={classes.container}>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Variants</TableCell>
                    {methodologies?.map(methodology => {
                      return (
                        <TableCell key={methodology.testName}>{methodology.testName}</TableCell>
                      );
                    })}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {methodologies?.map(methodology => {
                    const [data, setData] = React.useState<LTV3Data[]>();
                    useEffect(() => {
                      fetch(`/frontend/bandit/${channel}/${methodology.testName}/ltv3`)
                        .then(resp => resp.json())
                        .then(data => {
                          setData(data);
                        });
                    }, [testName, channel]);

                    console.log('Data: ', data);
                    return (
                      <>
                        {data?.map(row => (
                          <TableRow key={row.variant_name}>
                            <TableCell>{row.variant_name}</TableCell>
                            <TableCell>{row.ltv3}</TableCell>
                          </TableRow>
                        ))}
                      </>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        </Dialog>
      </div>
    </>
  );
};
