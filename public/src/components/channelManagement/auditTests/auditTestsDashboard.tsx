import React, { useEffect, useState } from 'react';
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
import { AuditDataRow, AuditTestsTable } from './auditTestsTable';
import { useParams } from 'react-router-dom';

const useStyles = makeStyles(({ spacing, palette }: Theme) => ({
  mainContainer: {
    overflow: 'scroll',
  },
  searchContainer: {
    margin: '50px',
    display: 'flex',
    gap: spacing(5),
  },
  sectionContainer: {
    display: 'flexWrap',
    width: '500px',
    borderColor: `2px solid ${{ color: grey[700] }}`,
    borderRadius: '2px',
  },
  heading: {
    fontSize: 20,
    color: palette.grey[900],
    fontWeight: 500,
  },
  buttonContainer: {
    marginTop: spacing(7),
    width: '300px',
  },
  tableContainer: {
    margin: spacing(7),
  },
}));

export const AuditTestsDashboard: React.FC = () => {
  const classes = useStyles();
  const testNameInQueryParams = useParams().testName;
  const channelInQueryParams = useParams().channel;
  const [fromUrl, setFromUrl] = useState(false); // used to trigger initial fetch once if set from url

  const [testName, setTestName] = useState('');
  const [channel, setChannel] = useState('');
  const onSelectChannelChange = (event: SelectChangeEvent) => {
    setChannel(event.target.value);
  };

  const [rows, setRows] = useState<AuditDataRow[]>([]);
  const fetchAuditData = () => {
    fetch(`/frontend/audit/${channel}/${testName}`)
      .then(resp => resp.json())
      .then(rows => setRows(rows));
  };

  useEffect(() => {
    if (testNameInQueryParams && channelInQueryParams) {
      setTestName(testNameInQueryParams);
      setChannel(channelInQueryParams);
      setFromUrl(true);
    }
  }, [testNameInQueryParams, channelInQueryParams]);

  useEffect(() => {
    if (fromUrl && testName && channel) {
      setFromUrl(false);
      fetchAuditData();
    }
  }, [testName, channel]);

  return (
    <div className={classes.mainContainer}>
      <div className={classes.searchContainer}>
        <div>
          <div className={classes.sectionContainer}>
            <Typography className={classes.heading}>Test Name</Typography>
            <TextField
              id="test-name"
              name="name"
              margin="normal"
              variant="outlined"
              value={testName}
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
          <Button variant="outlined" onClick={fetchAuditData}>
            Get audit
          </Button>
        </div>
      </div>
      <div className={classes.tableContainer}>
        <AuditTestsTable testName={testName} rows={rows} />
      </div>
    </div>
  );
};
