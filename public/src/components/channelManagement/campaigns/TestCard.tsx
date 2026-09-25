import { Box, Button, Card, CardActions, CardContent } from '@mui/material';
import { styled } from '@mui/material/styles';
import React from 'react';
import { Link } from 'react-router-dom';
import { Test, Variant } from '../helpers/shared';
import TestDataButton from './TestDataButton';

const StyledCard = styled(Card, {
  shouldForwardProp: (prop) => prop !== 'status',
})<{ status: Test['status'] }>(({ status }) => ({
  marginBottom: '4px',
  border: status === 'Archived' ? '1px dashed #c7cbd9' : '1px solid #c7cbd9',
}));

const StyledCardContent = styled(CardContent)({
  fontSize: '16px',
});

const LinkButton = styled(Link)({
  textDecoration: 'none',
});

const LinkButtonBackground = styled(Button)({
  backgroundColor: '#fafbff',
});

const DataContainer = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: '1fr 2fr',
  columnGap: theme.spacing(2),
  justifyItems: 'start',
  marginLeft: theme.spacing(3),
}));

const VariantsData = styled(Box)({
  fontSize: '14px',
});

const DataWarning = styled('span')({
  fontSize: '14px',
  color: '#f00',
  fontStyle: 'italic',
});

const PriorityAndStatusLine = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(2),
}));

const PrioritySpan = styled('span')({
  padding: '4px 8px',
  border: '1px solid black',
  marginRight: '8px',
});

const StatusSpan = styled('span')<{ status: Test['status'] }>(({ status }) => {
  if (status === 'Live') {
    return {
      padding: '4px 8px',
      border: '1px solid black',
      backgroundColor: '#f00',
      fontWeight: 'bold',
      color: '#fff',
    };
  }
  if (status === 'Draft') {
    return {
      padding: '4px 8px',
      border: '1px solid black',
      backgroundColor: '#ddd',
      color: '#000',
    };
  }
  return {
    padding: '4px 8px',
    border: '1px solid lightgray',
    backgroundColor: '#fff',
    color: '#000',
  };
});

const CohortLine = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(2),
}));

const CohortSelectedSpan = styled('span')({
  fontSize: '13px',
  marginLeft: '4px',
  padding: '4px 8px',
  border: '1px solid black',
  backgroundColor: '#00a',
  fontWeight: 'bold',
  color: '#fff',
});

const LocationsLine = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(2),
}));

const LocationSelectedSpan = styled('span')({
  fontSize: '13px',
  marginLeft: '4px',
  padding: '4px 8px',
  border: '1px solid black',
  backgroundColor: '#0a0',
  fontWeight: 'bold',
  color: '#fff',
});

const NotSelectedSpan = styled('span')({
  fontSize: '13px',
  marginLeft: '4px',
  padding: '4px 8px',
  border: '1px solid black',
  backgroundColor: '#eee',
  color: '#555',
});

const TestNameBlockContainer = styled(Box)({
  width: '100%',
  display: 'flex',
  alignItems: 'flex-start',
  justifyContent: 'space-between',
});

const TestNameBlockNames = styled(Box)({
  width: '50%',
});

const TestName = styled(Box)({
  fontSize: '14px',
  fontStyle: 'italic',
});

const TestNickname = styled(Box)({
  fontSize: '16px',
  fontWeight: 'bold',
});

const ArchivedTestNickname = styled(Box)({
  fontSize: '16px',
});

const TestNameBlockActions = styled(Box)({
  width: '40%',
  textAlign: 'right',
});

interface TestCardProps {
  test: Test;
  keyId: string;
  linkPath: string;
}

function TestCard({ test, keyId, linkPath }: TestCardProps): React.ReactElement {
  const getVariantNames = (variants: Variant[]) => {
    if (variants.length > 0) {
      return <VariantsData>Variants: {variants.map((v) => v.name).join(', ')}</VariantsData>;
    }
    return <DataWarning>No Variants have been created for this Test.</DataWarning>;
  };

  const getPriorityAndStatus = (test: Test) => {
    return (
      <PriorityAndStatusLine>
        Priority: <PrioritySpan>{test.priority}</PrioritySpan>
        Status: <StatusSpan status={test.status}>{test.status}</StatusSpan>
      </PriorityAndStatusLine>
    );
  };

  const getCohort = (test: Test) => {
    const userCohort = test.userCohort;

    const CohortTag = (wanted: string) =>
      userCohort === 'Everyone' || userCohort === wanted ? CohortSelectedSpan : NotSelectedSpan;

    const ExistingSupportersTag = CohortTag('AllExistingSupporters');
    const NonSupportersTag = CohortTag('AllNonSupporters');

    return (
      <CohortLine>
        Cohort:
        <ExistingSupportersTag>Existing Supporters</ExistingSupportersTag>
        <NonSupportersTag>Non-Supporters</NonSupportersTag>
      </CohortLine>
    );
  };

  const getLocations = (test: Test) => {
    const locations: Array<string | number> = test.locations;

    const LocationTag = (wanted: string) =>
      locations.includes(wanted) ? LocationSelectedSpan : NotSelectedSpan;

    if (!locations.length) {
      return (
        <LocationsLine>
          Locations: <DataWarning>No locations have been selected for this Test.</DataWarning>
        </LocationsLine>
      );
    }

    const AUTag = LocationTag('AUDCountries');
    const CATag = LocationTag('Canada');
    const EUTag = LocationTag('EURCountries');
    const NZTag = LocationTag('NZDCountries');
    const UKTag = LocationTag('GBPCountries');
    const USTag = LocationTag('UnitedStates');
    const ROWTag = LocationTag('International');

    return (
      <LocationsLine>
        Locations:
        <AUTag>AU</AUTag>
        <CATag>CA</CATag>
        <EUTag>EU</EUTag>
        <NZTag>NZ</NZTag>
        <UKTag>UK</UKTag>
        <USTag>US</USTag>
        <ROWTag>ROW</ROWTag>
      </LocationsLine>
    );
  };

  const getTestNameBlock = () => {
    const Nickname = test.status === 'Archived' ? ArchivedTestNickname : TestNickname;
    return (
      <TestNameBlockContainer>
        <TestNameBlockNames>
          <Nickname>{test.nickname ?? test.name}</Nickname>
          <TestName>Tracking name: {test.name}</TestName>
        </TestNameBlockNames>
        <TestNameBlockActions>
          {test.status !== 'Archived' && (
            <LinkButton key={keyId} to={`${linkPath}/${test.name}`}>
              <LinkButtonBackground variant="contained">Test page</LinkButtonBackground>
            </LinkButton>
          )}
          <TestDataButton test={test} />
        </TestNameBlockActions>
      </TestNameBlockContainer>
    );
  };

  return (
    <StyledCard status={test.status}>
      <StyledCardContent>
        <CardActions>{getTestNameBlock()}</CardActions>
        <DataContainer>
          <div>
            {getVariantNames(test.variants)}
            {getPriorityAndStatus(test)}
          </div>
          <div>
            {getCohort(test)}
            {getLocations(test)}
          </div>
        </DataContainer>
      </StyledCardContent>
    </StyledCard>
  );
}

export default TestCard;
