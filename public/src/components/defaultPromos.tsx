import {
  Button,
  FormControlLabel,
  TextField,
  makeStyles,
} from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import withS3Data, { InnerProps } from '../hocs/withS3Data';
import {
  fetchSupportFrontendSettings,
  saveSupportFrontendSettings,
  SupportFrontendSettingsType,
} from '../utils/requests';

type ProductName = 'guardianWeekly' | 'paper';

type DefaultPromos = {
  [key in ProductName]: string[];
};

const useStyles = makeStyles(() => ({
  container: {
    margin: '30px',
    maxWidth: '500px',
    display: 'flex',
    flexDirection: 'column',
    '& > * + *': {
      marginTop: '5px',
    },
  },
}));

const DefaultPromos: React.FC<InnerProps<DefaultPromos>> = ({
  data,
  setData,
  saveData,
  saving,
}: InnerProps<DefaultPromos>) => {
  const [gwPromosString, setGwPromosString] = useState<string>();

  useEffect(() => {
    setGwPromosString(data.guardianWeekly.join(', '));
  }, []);

  const classes = useStyles();

  return (
    <div className={classes.container}>
      <TextField
        value={gwPromosString}
        name="guardianWeeklyDefaultPromos"
        fullWidth={true}
        onChange={e => {
          const inputValue = e.target.value;
          setGwPromosString(inputValue);

          const parsedInputValue = inputValue.split(',').map(promo => promo.trim());
          setData({
            ...data,
            guardianWeekly: parsedInputValue,
          });
        }}
        type="text"
        label="Guardian Weekly"
      />
      {/* <TextField
        value={data.paper.join(', ')}
        name="paperDefaultPromos"
        fullWidth={true}
        onChange={e => console.log(e.target)}
        type="text"
        label="Paper"
      /> */}
      <Button
        onClick={saveData}
        color="primary"
        variant="contained"
        size="large"
        fullWidth={false}
        disabled={saving}
      >
        Submit
      </Button>
    </div>
  );
};

export default withS3Data<DefaultPromos>(
  DefaultPromos,
  () => fetchSupportFrontendSettings(SupportFrontendSettingsType.defaultPromos),
  data => saveSupportFrontendSettings(SupportFrontendSettingsType.defaultPromos, data),
);
