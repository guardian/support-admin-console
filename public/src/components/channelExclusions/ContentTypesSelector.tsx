import React, { useEffect } from 'react';
import { FormControl, FormControlLabel, Radio, RadioGroup, Typography, Box } from '@mui/material';
import { ExclusionRule } from '../../models/exclusions';
import { ChannelKey } from './util';

const hasBothContentTypes = (rule: ExclusionRule): boolean =>
  rule.contentTypes === undefined ||
  (rule.contentTypes.length === 2 &&
    rule.contentTypes.includes('Fronts') &&
    rule.contentTypes.includes('Articles'));

interface ContentTypesSelectorProps {
  rule: ExclusionRule;
  index: number;
  channel: ChannelKey;
  editMode: boolean;
  onUpdateRule: (index: number, rule: ExclusionRule) => void;
}

const ContentTypesSelector: React.FC<ContentTypesSelectorProps> = ({
  rule,
  index,
  channel,
  editMode,
  onUpdateRule,
}) => {
  // Epic and Gutter Ask exclusions target article pages only, so content type is locked.
  const forceArticlesOnly = channel === 'epic' || channel === 'gutterAsk';

  useEffect(() => {
    if (
      forceArticlesOnly &&
      !(rule.contentTypes?.length === 1 && rule.contentTypes.includes('Articles'))
    ) {
      onUpdateRule(index, { ...rule, contentTypes: ['Articles'] });
    }
  }, [forceArticlesOnly, index, onUpdateRule, rule]);

  const getContentTypeValue = (): string => {
    if (forceArticlesOnly) {
      return 'articles';
    }

    if (hasBothContentTypes(rule)) {
      return 'both';
    }
    if (rule.contentTypes?.length === 1 && rule.contentTypes.includes('Fronts')) {
      return 'fronts';
    }
    return 'articles';
  };

  const handleContentTypeChange = (value: string): void => {
    if (value === 'fronts') {
      onUpdateRule(index, { ...rule, contentTypes: ['Fronts'] });
    } else if (value === 'articles') {
      onUpdateRule(index, { ...rule, contentTypes: ['Articles'] });
    } else {
      onUpdateRule(index, { ...rule, contentTypes: ['Fronts', 'Articles'] });
    }
  };

  return (
    <Box sx={{ flex: '1 1 100%' }}>
      <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1, mb: 1 }}>
        <Typography variant="subtitle2">Content Types</Typography>
        {forceArticlesOnly && (
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            ({channel} is only used in articles)
          </Typography>
        )}
      </Box>
      <FormControl disabled={!editMode || forceArticlesOnly}>
        <RadioGroup
          row
          value={getContentTypeValue()}
          onChange={(e) => handleContentTypeChange(e.target.value)}
        >
          <FormControlLabel value="fronts" control={<Radio />} label="Fronts" />
          <FormControlLabel value="articles" control={<Radio />} label="Articles" />
          <FormControlLabel value="both" control={<Radio />} label="Fronts & Articles" />
        </RadioGroup>
      </FormControl>
    </Box>
  );
};

export default ContentTypesSelector;
