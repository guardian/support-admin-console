import React from 'react';
import { FormControl, FormControlLabel, Radio, RadioGroup, Typography, Box } from '@mui/material';
import { ExclusionRule } from '../../models/exclusions';

const hasBothContentTypes = (rule: ExclusionRule): boolean =>
  rule.contentTypes === undefined ||
  (rule.contentTypes.length === 2 &&
    rule.contentTypes.includes('Fronts') &&
    rule.contentTypes.includes('Articles'));

interface ContentTypesSelectorProps {
  rule: ExclusionRule;
  index: number;
  editMode: boolean;
  onUpdateRule: (index: number, rule: ExclusionRule) => void;
}

const ContentTypesSelector: React.FC<ContentTypesSelectorProps> = ({
  rule,
  index,
  editMode,
  onUpdateRule,
}) => {
  const getContentTypeValue = (): string => {
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
      <Typography variant="subtitle2" sx={{ mb: 1 }}>
        Content Types
      </Typography>
      <FormControl disabled={!editMode}>
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
