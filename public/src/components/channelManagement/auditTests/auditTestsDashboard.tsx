import React, { useState } from 'react';
import {
  Button,
  FormControl,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
  Theme,
  Typography,
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import { grey } from '@mui/material/colors';
import { useForm } from 'react-hook-form';
import { AuditTestsButton } from './AuditTestsButton';

const useStyles = makeStyles(({ spacing, palette }: Theme) => ({
  container: {
    margin: '10px',
  },
  sectionContainer: {
    display: 'flexWrap',
    width: '500px',
    borderColor: `2px solid ${{ color: grey[700] }}`,
    borderRadius: '2px',
    gap: spacing(12),
    marginBottom: spacing(3),
  },
  heading: {
    fontSize: 20,
    color: palette.grey[900],
    fontWeight: 500,
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'top',
    marginTop: spacing(2),
  },
}));
export const EMPTY_ERROR_HELPER_TEXT = 'Field cannot be empty - please enter some text';

interface FormData {
  name: string;
}

export const AuditTestsDashboard: React.FC = () => {
  const classes = useStyles();
  const [testName, setTestName] = useState('');
  const { register, errors } = useForm<FormData>();
  console.log('Test Name', testName);
  const [channel, setChannel] = useState('');
  const onSelectChannelChange = (event: SelectChangeEvent) => {
    const value = event.target.value;
    console.log('Channel', value);
    setChannel(event.target.value);
  };

  return (
    <div className={classes.container}>
      <div className={classes.container}>
        <div className={classes.sectionContainer}>
          <Typography className={classes.heading}>Test Name</Typography>
          <TextField
            id="test-name"
            inputRef={register({
              required: EMPTY_ERROR_HELPER_TEXT,
            })}
            error={errors.name !== undefined}
            name="name"
            margin="normal"
            variant="outlined"
            autoFocus
            fullWidth
            onChange={event => {
              setTestName(event.target.value);
            }}
          />
        </div>
        <div className={classes.sectionContainer}>
          <Typography className={classes.heading}>Channel</Typography>
          <FormControl fullWidth>
            <Select
              labelId="channel"
              id="channel-select"
              value={channel}
              label="Channel"
              onChange={onSelectChannelChange}
            >
              <MenuItem value={'Epic'} key={'Epic'}>
                Epic
              </MenuItem>
              <MenuItem value={'EpicAMP'} key={'EpicAMP'}>
                EpicAMP
              </MenuItem>
              <MenuItem value={'EpicAppleNews'} key={'EpicAppleNews'}>
                EpicAppleNews
              </MenuItem>
              <MenuItem value={'EpicLiveblog'} key={'EpicLiveblog'}>
                EpicLiveblog
              </MenuItem>
              <MenuItem value={'Banner1'} key={'Banner1'}>
                Banner1
              </MenuItem>
              <MenuItem value={'Banner2'} key={'Banner2'}>
                Banner2
              </MenuItem>
              <MenuItem value={'Header'} key={'Header'}>
                Header
              </MenuItem>
              <MenuItem value={'GutterLiveblog'} key={'GutterLiveblog'}>
                GutterLiveblog
              </MenuItem>
              <MenuItem value={'SupportLandingPage'} key={'SupportLandingPage'}>
                SupportLandingPage
              </MenuItem>
            </Select>
          </FormControl>
        </div>
      </div>
      <div className={classes.buttonContainer}>
        <AuditTestsButton testName={testName} channel={channel} />
      </div>
    </div>
  );
};
