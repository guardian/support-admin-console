import { format } from 'date-fns';
import React, { useEffect, useState } from 'react';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles(() => ({
  webTitle: {
    fontSize: 18,
    fontStyle: 'italic',
  },
  timestampContainer: {
    fontSize: 13,
    fontWeight: 'normal',
  },
  timestampLabel: {
    fontWeight: 500,
    width: '120px',
    display: 'inline-block',
  },
}));

const formatDate = (date: Date): string => format(date, 'HH:mm:ss MM/dd/yyyy');

interface Content {
  response: {
    content: {
      webTitle: string;
      webPublicationDate: string;
    };
  };
}

interface ArticleDetailsProps {
  url: string;
  startTimestamp: string;
  region: string;
}

export const ArticleDetails: React.FC<ArticleDetailsProps> = ({
  url,
  startTimestamp,
  region,
}: ArticleDetailsProps) => {
  const classes = useStyles();
  const [content, setContent] = useState<Content | null>(null);

  useEffect(() => {
    fetch(`/capi/content/${url}`)
      .then((resp) => resp.json())
      .then(setContent);
  }, []);

  if (content) {
    const { webTitle, webPublicationDate } = content.response.content;
    return (
      <div>
        <div className={classes.webTitle}>{webTitle}</div>
        <div className={classes.timestampContainer}>
          <span className={classes.timestampLabel}>Published:</span>{' '}
          {formatDate(new Date(webPublicationDate))}
        </div>
        <div className={classes.timestampContainer}>
          <span className={classes.timestampLabel}>Went super in {region}:</span>{' '}
          {formatDate(new Date(startTimestamp))}
        </div>
      </div>
    );
  }
  return null;
};
