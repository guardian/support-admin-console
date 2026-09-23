import {
  Button,
  FormControl,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
  Typography,
} from '@mui/material';
import { grey } from '@mui/material/colors';
import { styled } from '@mui/material/styles';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { AuditDataRow, AuditTestsTable } from './auditTestsTable';

const SectionContainer = styled('div')({
  display: 'flexWrap',
  width: '500px',
  borderColor: `2px solid ${grey[700]}`,
  borderRadius: '2px',
});

const SectionHeading = styled(Typography)(({ theme }) => ({
  fontSize: 20,
  color: theme.palette.grey[900],
  fontWeight: 500,
}));

const MainContainer = styled('div')({
  overflow: 'scroll',
});

const SearchContainer = styled('div')(({ theme }) => ({
  margin: '50px',
  display: 'flex',
  gap: theme.spacing(5),
}));

const ButtonContainer = styled('div')(({ theme }) => ({
  marginTop: theme.spacing(7),
  width: '300px',
}));

const StyledTableContainer = styled('div')(({ theme }) => ({
  margin: theme.spacing(7),
}));

export const AuditTestsDashboard: React.FC = () => {
  const { testName: testNameInQueryParams, channel: channelInQueryParams } = useParams();
  const hasFetchedFromUrlRef = useRef(false);

  const [testName, setTestName] = useState(testNameInQueryParams ?? '');
  const [channel, setChannel] = useState(channelInQueryParams ?? '');

  const onSelectChannelChange = (event: SelectChangeEvent) => {
    setChannel(event.target.value);
  };

  const [rows, setRows] = useState<AuditDataRow[]>([]);
  const fetchAuditData = useCallback(() => {
    void fetch(`/frontend/audit/${channel}/${testName}`)
      .then((resp) => resp.json())
      .then((data: AuditDataRow[]) => setRows(data));
  }, [channel, testName]);

  useEffect(() => {
    if (testNameInQueryParams && channelInQueryParams && !hasFetchedFromUrlRef.current) {
      hasFetchedFromUrlRef.current = true;
      fetchAuditData();
    }
  }, [testNameInQueryParams, channelInQueryParams, fetchAuditData]);

  return (
    <MainContainer>
      <SearchContainer>
        <div>
          <SectionContainer>
            <SectionHeading>Test Name</SectionHeading>
            <TextField
              id="test-name"
              name="name"
              margin="normal"
              variant="outlined"
              value={testName}
              autoFocus
              fullWidth
              onChange={(event) => {
                setTestName(event.target.value);
              }}
            />
          </SectionContainer>
          <SectionContainer>
            <SectionHeading>Channel</SectionHeading>
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
          </SectionContainer>
        </div>
        <ButtonContainer>
          <Button variant="outlined" onClick={fetchAuditData}>
            Get audit
          </Button>
        </ButtonContainer>
      </SearchContainer>
      <StyledTableContainer>
        <AuditTestsTable testName={testName} rows={rows} />
      </StyledTableContainer>
    </MainContainer>
  );
};
