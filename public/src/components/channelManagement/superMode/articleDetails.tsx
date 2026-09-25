import { styled } from '@mui/material/styles';
import { format } from 'date-fns';
import React, { useEffect, useState } from 'react';

const WebTitle = styled('div')({
  fontSize: 18,
  fontStyle: 'italic',
});
const TimestampContainer = styled('div')({
  fontSize: 13,
  fontWeight: 'normal',
});
const TimestampLabel = styled('span')({
  fontWeight: 500,
  width: '120px',
  display: 'inline-block',
});

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
  const [content, setContent] = useState<Content | null>(null);

  useEffect(() => {
    void fetch(`/capi/content/${url}`)
      .then((resp) => resp.json())
      .then(setContent);
  }, [url]);

  if (content) {
    const { webTitle, webPublicationDate } = content.response.content;
    return (
      <div>
        <WebTitle>{webTitle}</WebTitle>
        <TimestampContainer>
          <TimestampLabel>Published:</TimestampLabel> {formatDate(new Date(webPublicationDate))}
        </TimestampContainer>
        <TimestampContainer>
          <TimestampLabel>Went super in {region}:</TimestampLabel>{' '}
          {formatDate(new Date(startTimestamp))}
        </TimestampContainer>
      </div>
    );
  }
  return null;
};
