import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import { AccordionSummary, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import React from 'react';
import { TestPlatform, TestType } from '../../channelManagement/helpers/shared';
import VariantSummaryWebPreviewButton, { ArticleType } from './variantSummaryWebPreviewButton';

const Container = styled('div')({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  width: '100%',
});
const NameContainer = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
}));
const Icon = styled(InsertDriveFileIcon)(({ theme }) => ({
  display: 'inline-block',
  fill: theme.palette.grey[700],
}));
const Text = styled(Typography)({
  fontSize: 14,
  fontWeight: 500,
  letterSpacing: 1,
  textTransform: 'uppercase',
});
const ButtonsContainer = styled('div')({
  display: 'flex',
  flexDirection: 'row',
  gap: '20px',
});

interface VariantSummaryProps {
  name: string;
  testName: string;
  testType: TestType;
  isInEditMode: boolean;
  topButton?: React.ReactElement;
  platform: TestPlatform;
  articleType: ArticleType;
  webPreviewUrl?: string;
}

const VariantSummary: React.FC<VariantSummaryProps> = ({
  name,
  testName,
  testType,
  isInEditMode,
  topButton,
  platform,
  articleType,
  webPreviewUrl,
}: VariantSummaryProps) => {
  return (
    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
      <Container>
        <NameContainer>
          <Icon />

          <Text variant="h4">{name}</Text>
        </NameContainer>
        <ButtonsContainer>
          {topButton}
          <VariantSummaryWebPreviewButton
            name={name}
            testName={testName}
            testType={testType}
            platform={platform}
            isDisabled={isInEditMode}
            articleType={articleType}
            webPreviewUrl={webPreviewUrl}
          />
        </ButtonsContainer>
      </Container>
    </AccordionSummary>
  );
};

export default VariantSummary;
