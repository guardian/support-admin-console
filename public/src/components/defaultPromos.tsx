import { Button, TextField } from '@mui/material';
import { makeStyles } from '@mui/styles';
import React, { useState } from 'react';
import withS3Data, { InnerProps } from '../hocs/withS3Data';
import { parsePromoInput } from '../utils/parsePromoInput';
import {
  fetchSupportFrontendSettings,
  saveSupportFrontendSettings,
  SupportFrontendSettingsType,
} from '../utils/requests';

type ProductName = 'guardianWeekly' | 'paper' | 'digital';

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
      marginTop: '16px',
    },
  },
}));

const DefaultPromos: React.FC<InnerProps<DefaultPromos>> = ({
  data,
  update,
  sendToS3,
  saving,
}: InnerProps<DefaultPromos>) => {
  const [gwPromosString, setGwPromosString] = useState<string>(data.guardianWeekly.join(', '));
  const [paperPromosString, setpaperPromosString] = useState<string>(data.paper.join(', '));
  const [digitalPromoString, setdigitalPromosString] = useState<string>(data.digital.join(', '));

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

          const parsedInputValue = parsePromoInput(inputValue);
          update({
            ...data,
            guardianWeekly: parsedInputValue,
          });
        }}
        type="text"
        label="Guardian Weekly"
      />
      <TextField
        value={paperPromosString}
        name="paperDefaultPromos"
        fullWidth={true}
        onChange={e => {
          const inputValue = e.target.value;
          setpaperPromosString(inputValue);

          const parsedInputValue = parsePromoInput(inputValue);
          update({
            ...data,
            paper: parsedInputValue,
          });
        }}
        type="text"
        label="Paper"
      />
      <TextField
        value={digitalPromoString}
        name="digitalDefaultPromos"
        fullWidth={true}
        onChange={e => {
          const inputValue = e.target.value;
          setdigitalPromosString(inputValue);

          const parsedInputValue = parsePromoInput(inputValue);
          update({
            ...data,
            digital: parsedInputValue,
          });
        }}
        type="text"
        label="Digital"
      />
      <Button
        onClick={sendToS3}
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
