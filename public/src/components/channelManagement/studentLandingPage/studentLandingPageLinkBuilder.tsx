import { FormHelperText, Link, Theme } from '@mui/material';
import { makeStyles } from '@mui/styles';
import React from 'react';
import { StudentLandingPageTest } from '../../../models/studentLandingPage';
import { getStage } from '../../../utils/stage';
import URLGeneratorCopyButton from '../../shared/urlGeneratorCopyButton';

interface StudentLandingPageLinkBuilderProps {
  test: StudentLandingPageTest;
}

const useStyles = makeStyles(({ spacing }: Theme) => ({
  container: {
    width: '100%',
    paddingTop: spacing(2),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  sectionTitle: {
    marginBottom: spacing(2),
    fontWeight: 600,
  },
  urlPreviewBlock: {
    color: '#555',
    display: 'flex',
    gap: spacing(1),
  },
  fields: {
    display: 'flex',
    flexDirection: 'row',
    rowGap: spacing(4),
    columnGap: spacing(2),
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  infoText: {
    fontSize: '0.75rem',
    color: '#666',
    fontStyle: 'italic',
    position: 'absolute',
  },
  urlPreviewTitle: {
    fontWeight: 500,
    whiteSpace: 'nowrap',
  },
  urlPreview: {
    wordBreak: 'break-all',
    alignSelf: 'center',
  },
  errorText: {
    color: 'rgba(0 0 0 / 1)',
    backgroundColor: 'rgba(255 255 0 / 1)',
  },
}));

export const StudentLandingPageLinkBuilder: React.FC<StudentLandingPageLinkBuilderProps> = ({
  test,
}: StudentLandingPageLinkBuilderProps) => {
  const classes = useStyles();

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

  if (!test.countryGroupId) {
    errorMessageBuilder.push('The Country is required. ');
  }
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
      {errorMessage && (
        <FormHelperText className={classes.errorText}>{errorMessage}</FormHelperText>
      )}
      {url && (
        <>
          <div className={classes.fields}>
            <div className={classes.urlPreviewBlock}>
              <span className={classes.urlPreviewTitle}>Please test before use:</span>
              <span className={classes.urlPreview}>
                <Link href={url} target="_blank" rel="noopener" title="will open in another tab">
                  {url}
                </Link>
              </span>
            </div>
            <URLGeneratorCopyButton url={url} />
          </div>
        </>
      )}
    </>
  );
};
