import { FormHelperText, Link } from '@mui/material';
import { styled } from '@mui/material/styles';
import React from 'react';
import { StudentLandingPageTest } from '../../../models/studentLandingPage';
import { getStage } from '../../../utils/stage';
import URLGeneratorCopyButton from '../../shared/urlGeneratorCopyButton';

interface StudentLandingPageLinkBuilderProps {
  test: StudentLandingPageTest;
}

const Fields = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  rowGap: theme.spacing(4),
  columnGap: theme.spacing(2),
  alignItems: 'center',
  flexWrap: 'wrap',
}));
const UrlPreviewBlock = styled('div')(({ theme }) => ({
  color: '#555',
  display: 'flex',
  gap: theme.spacing(1),
}));
const UrlPreviewTitle = styled('span')({
  fontWeight: 500,
  whiteSpace: 'nowrap',
});
const UrlPreview = styled('span')({
  wordBreak: 'break-all',
  alignSelf: 'center',
});
const ErrorText = styled(FormHelperText)({
  color: 'rgba(0 0 0 / 1)',
  backgroundColor: 'rgba(255 255 0 / 1)',
});

export const StudentLandingPageLinkBuilder: React.FC<StudentLandingPageLinkBuilderProps> = ({
  test,
}: StudentLandingPageLinkBuilderProps) => {
  const stage = getStage();
  const countryGroupId = test.countryGroupId;
  const promoCode = test.variants[0].promoCodes[0];

  const buildBaseUrl = () => {
    return `https://support.${stage !== 'PROD' ? 'code.dev-' : ''}theguardian.com`;
  };
  const getCountryIdFromRegion = () => {
    return countryGroupId.toString().substring(0, 2).toLowerCase();
  };

  const baseErrorMessage =
    'The link cannot be generated yet because something is missing - please check the following: ';
  const errorMessageBuilder = [baseErrorMessage];

  if (!promoCode) {
    errorMessageBuilder.push('The promoCode is missing. ');
  }

  const errorMessage = errorMessageBuilder.length > 1 ? errorMessageBuilder.join(' ') : '';
  const url =
    errorMessage === ''
      ? `${buildBaseUrl()}/${getCountryIdFromRegion()}/student/${test.name}?promoCode=${promoCode}`
      : '';

  return (
    <>
      {errorMessage && <ErrorText>{errorMessage}</ErrorText>}
      {url && (
        <>
          <Fields>
            <UrlPreviewBlock>
              <UrlPreviewTitle>Please test before use:</UrlPreviewTitle>
              <UrlPreview>
                <Link href={url} target="_blank" rel="noopener" title="will open in another tab">
                  {url}
                </Link>
              </UrlPreview>
            </UrlPreviewBlock>
            <URLGeneratorCopyButton url={url} />
          </Fields>
        </>
      )}
    </>
  );
};
