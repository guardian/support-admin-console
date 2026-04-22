import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import type { Theme } from '@mui/material';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Alert,
  TextField,
  Typography,
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import React from 'react';
import type {
  ExclusionRule as ExclusionRuleType,
  ExclusionSettings,
} from '../../models/exclusions';
import { SectionsEditor } from '../channelManagement/epicTests/sectionsEditor';
import { TagsEditor } from '../channelManagement/epicTests/tagsEditor';
import ContentTypesSelector from './ContentTypesSelector';
import RuleHeader from './RuleHeader';
import { useExclusionRuleHandlers } from './useExclusionRuleHandlers';
import type { ChannelKey } from './util';

const useStyles = makeStyles(({ spacing }: Theme) => ({
  accordion: {
    marginBottom: spacing(2),
    backgroundColor: 'transparent',
  },
  ruleFields: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: spacing(2),
  },
  field: {
    flex: '1 0 200px',
  },
  fullRowField: {
    flex: '1 1 100%',
  },
  dateRange: {
    display: 'flex',
    gap: spacing(2),
    flex: '1 1 100%',
  },
}));

interface ExclusionRuleProps {
  channel: ChannelKey;
  label: string;
  data: ExclusionSettings;
  index: number;
  rule: ExclusionRuleType;
  canEdit: boolean;
  saving: boolean;
  onUpdateSettings: (settings: ExclusionSettings) => void;
  onPersistSettings: (settings: ExclusionSettings) => void;
}

const ExclusionRule: React.FC<ExclusionRuleProps> = ({
  channel,
  label,
  data,
  index,
  rule,
  canEdit,
  saving,
  onUpdateSettings,
  onPersistSettings,
}) => {
  const classes = useStyles();
  const {
    formRule,
    isExpanded,
    isRuleInEditMode,
    isRuleUnsaved,
    touchedNameFields,
    setIsExpanded,
    handleNameBlur,
    handleStartEditRule,
    handleSaveRule,
    handleCancelRule,
    handleDeleteRule,
    handleRuleChange,
    handleUpdateRuleWithIndex,
  } = useExclusionRuleHandlers({
    channel,
    label,
    data,
    onUpdateSettings,
    onPersistSettings,
    index,
    rule,
  });

  return (
    <form>
      <Accordion
        key={index}
        className={classes.accordion}
        disableGutters
        expanded={isExpanded}
        onChange={(_, expanded) => setIsExpanded(expanded)}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <RuleHeader
            state={{
              rule: formRule,
              index,
              editMode: isRuleInEditMode,
              isUnsaved: isRuleUnsaved,
              canEdit,
              saving,
              touchedNameFields,
            }}
            handlers={{
              onUpdateRule: handleUpdateRuleWithIndex,
              onStartEditRule: handleStartEditRule,
              onSaveRule: handleSaveRule,
              onCancelRule: handleCancelRule,
              onDeleteRule: handleDeleteRule,
              onNameBlur: handleNameBlur,
            }}
          />
        </AccordionSummary>
        <AccordionDetails>
          <div className={classes.ruleFields}>
            <ContentTypesSelector
              rule={formRule}
              index={index}
              channel={channel}
              editMode={isRuleInEditMode}
              onUpdateRule={handleUpdateRuleWithIndex}
            />
            <Alert severity="info" className={classes.fullRowField}>
              Pages for this exclusion are determined by Section IDs <strong>OR</strong> Tag IDs. If
              either list matches, the rule exclusion will apply.
            </Alert>
            <div className={classes.fullRowField}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Section IDs
              </Typography>
              {!isRuleInEditMode && (!formRule.sectionIds || formRule.sectionIds.length === 0) ? (
                <Typography variant="body2" color="textSecondary">
                  No section IDs
                </Typography>
              ) : (
                <SectionsEditor
                  label="Section IDs"
                  ids={formRule.sectionIds ?? []}
                  onUpdate={(ids) => handleRuleChange({ ...formRule, sectionIds: ids })}
                  disabled={!isRuleInEditMode}
                />
              )}
            </div>
            <div className={classes.fullRowField}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Tag IDs
              </Typography>
              {!isRuleInEditMode && (!formRule.tagIds || formRule.tagIds.length === 0) ? (
                <Typography variant="body2" color="textSecondary">
                  No tag IDs
                </Typography>
              ) : (
                <TagsEditor
                  label="Tag IDs"
                  ids={formRule.tagIds ?? []}
                  onUpdate={(ids) => handleRuleChange({ ...formRule, tagIds: ids })}
                  disabled={!isRuleInEditMode}
                />
              )}
            </div>
          </div>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            Date Range{' '}
            <small>
              (The selected channel is suppressed during this period. Start and end dates are
              inclusive.)
            </small>
          </Typography>
          <div className={classes.dateRange}>
            <TextField
              className={classes.field}
              label="Start Date"
              type="date"
              value={formRule.dateRange?.start ?? ''}
              onChange={(e) =>
                handleRuleChange({
                  ...formRule,
                  dateRange: e.target.value
                    ? { start: e.target.value, end: formRule.dateRange?.end ?? '' }
                    : undefined,
                })
              }
              variant="outlined"
              size="small"
              disabled={!isRuleInEditMode}
              InputLabelProps={{
                shrink: true,
              }}
            />
            <TextField
              className={classes.field}
              label="End Date"
              type="date"
              value={formRule.dateRange?.end ?? ''}
              onChange={(e) =>
                handleRuleChange({
                  ...formRule,
                  dateRange: e.target.value
                    ? { start: formRule.dateRange?.start ?? '', end: e.target.value }
                    : undefined,
                })
              }
              variant="outlined"
              size="small"
              disabled={!isRuleInEditMode}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </div>
        </AccordionDetails>
      </Accordion>
    </form>
  );
};

export default ExclusionRule;
