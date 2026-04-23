import React, { useEffect, useState } from 'react';
import { Region } from '../../../utils/models';
import { Institution } from '../../../models/studentLandingPage';
import { getStage } from '../../../utils/stage';
import URLGeneratorCopyButton from '../../shared/urlGeneratorCopyButton';
import { makeStyles } from '@mui/styles';
import { FormHelperText, Link, Theme } from '@mui/material';

interface StudentLandingPageLinkBuilderProps {
  countryGroupId: Region;
  institution: Institution;
  promoCode: string;
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
  countryGroupId,
  institution,
  promoCode,
}: StudentLandingPageLinkBuilderProps) => {
  const classes = useStyles();

  const [url, setUrl] = useState('');
  const [errorMessage, setErrorMessage] = useState(
    'Please set the fields and save the test - this will create the link which can then be previewed.',
  );

  const stage = getStage();
  const buildBaseUrl = () => {
    return `https://support.${stage !== 'PROD' ? 'code.dev-' : ''}theguardian.com`;
  };

  const getCountryIdFromRegion = () => {
    return countryGroupId.toString().substring(0, 2).toLowerCase();
  };

  const identifierOrAcronym = institution.identifier ?? institution.acronym; // TODO: once identifier in all tests, switch to identifier only.

  const buildFullUrl = () => {
    setUrl(
      `${buildBaseUrl()}/${getCountryIdFromRegion()}/student/${identifierOrAcronym}?promoCode=${promoCode}`,
    );
  };

  useEffect(() => {
    setUrl('');
    setErrorMessage('');
    const baseErrorMessage =
      'The link cannot be generated yet because something is missing - please check the following: ';
    const errorMessageBuilder = [baseErrorMessage];
    if (!countryGroupId) {
      errorMessageBuilder.push('The Country is required. ');
    }
    if (!institution.identifier) {
      errorMessageBuilder.push("The Institution's Unique Identifier is required. ");
    }
    if (!institution.acronym) {
      errorMessageBuilder.push("The Institution's Acronym is required. ");
    }
    if (!promoCode) {
      errorMessageBuilder.push('The promoCode is missing. ');
    }
    if (errorMessageBuilder.length > 1) {
      setErrorMessage(errorMessageBuilder.join(' '));
    } else {
      setErrorMessage('');
      buildFullUrl();
    }
  }, [countryGroupId, institution.acronym, promoCode]);

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
