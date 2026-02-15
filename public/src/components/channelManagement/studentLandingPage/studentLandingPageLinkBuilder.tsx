import React, { useEffect, useState } from 'react';
import { Region } from '../../../utils/models';
import { Institution } from '../../../models/studentLandingPage';
import { getStage } from '../../../utils/stage';
import URLGeneratorCopyButton from '../../shared/urlGeneratorCopyButton';
import { makeStyles } from '@mui/styles';
import { FormHelperText, Link, Theme } from '@mui/material';

interface StudentLandingPageLinkBuilderProps {
  regionId: Region;
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
  regionId,
  institution,
  promoCode,
}: StudentLandingPageLinkBuilderProps) => {
  const classes = useStyles();

  const [url, setUrl] = useState('');
  const [errorMessage, setErrorMessage] = useState(
    'Please set the above fields and save the test.',
  );

  const stage = getStage();
  const buildBaseUrl = () => {
    return `https://support.${stage !== 'PROD' ? 'code.dev-' : ''}theguardian.com`;
  };

  const getCountryIdFromRegion = () => {
    return regionId.toString().substring(0, 2).toLowerCase();
  };

  const buildFullUrl = () => {
    setUrl(
      `${buildBaseUrl()}/${getCountryIdFromRegion()}/student/${institution.acronym}?promoCode=${promoCode}`,
    );
  };

  useEffect(() => {
    setUrl('');
    setErrorMessage('');
    const baseErrorMessage =
      'The link cannot be generated yet because something is missing - please check the following: ';
    const errorMessageBuilder = [baseErrorMessage];
    if (!regionId) {
      errorMessageBuilder.push('The Country is required. ');
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
  }, [regionId, institution.acronym, promoCode]);

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
