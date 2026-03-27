import React, { useEffect, useState } from 'react';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  Divider,
  TextField,
  Typography,
  Theme,
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import AddIcon from '@mui/icons-material/Add';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { SectionsEditor } from '../channelManagement/epicTests/sectionsEditor';
import { TagsEditor } from '../channelManagement/epicTests/tagsEditor';
import { ExclusionRule } from '../../models/exclusions';
import RuleHeader from './RuleHeader';
import ContentTypesSelector from './ContentTypesSelector';

const useStyles = makeStyles(({ spacing }: Theme) => ({
  container: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  sectionHeader: {
    marginBottom: spacing(2),
    textTransform: 'capitalize',
  },
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
  addRuleButton: {
    marginBottom: spacing(2),
  },
  bottomDivider: {
    marginTop: 'auto',
  },
}));

interface ChannelExclusionsSectionProps {
  channel: string;
  label: string;
  rules: ExclusionRule[];
  editMode: boolean;
  canEdit: boolean;
  saving: boolean;
  editingRuleIndex: number | null;
  onStartEditRule: (index: number) => void;
  onSaveEdit: () => void;
  onCancelEdit: () => void;
  onUpdateRule: (index: number, rule: ExclusionRule) => void;
  onDeleteRule: (index: number) => void;
  onAddRule: () => void;
}

const ChannelExclusionsSection: React.FC<ChannelExclusionsSectionProps> = ({
  label,
  rules,
  editMode,
  canEdit,
  saving,
  editingRuleIndex,
  onStartEditRule,
  onSaveEdit,
  onCancelEdit,
  onUpdateRule,
  onDeleteRule,
  onAddRule,
}) => {
  const classes = useStyles();
  const [touchedNameFields, setTouchedNameFields] = useState<Set<number>>(new Set());
  const [expandedRuleIndex, setExpandedRuleIndex] = useState<number | false>(false);

  useEffect(() => {
    if (editingRuleIndex !== null) {
      setExpandedRuleIndex(editingRuleIndex);
    }
  }, [editingRuleIndex]);

  const handleNameBlur = (index: number) => {
    setTouchedNameFields((prev) => new Set(prev).add(index));
  };

  const handleStartEditRule = (index: number) => {
    setExpandedRuleIndex(index);
    onStartEditRule(index);
  };

  const renderRule = (rule: ExclusionRule, index: number) => {
    const isRuleInEditMode = editMode && editingRuleIndex === index;

    return (
      <Accordion
        key={index}
        className={classes.accordion}
        disableGutters
        expanded={expandedRuleIndex === index}
        onChange={(_, expanded) => setExpandedRuleIndex(expanded ? index : false)}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <RuleHeader
            rule={rule}
            index={index}
            editMode={isRuleInEditMode}
            canEdit={canEdit}
            saving={saving}
            onUpdateRule={onUpdateRule}
            onStartEditRule={handleStartEditRule}
            onSaveRule={onSaveEdit}
            onCancelRule={onCancelEdit}
            onDeleteRule={onDeleteRule}
            touchedNameFields={touchedNameFields}
            onNameBlur={handleNameBlur}
          />
        </AccordionSummary>
        <AccordionDetails>
          <div className={classes.ruleFields}>
            <ContentTypesSelector
              rule={rule}
              index={index}
              editMode={isRuleInEditMode}
              onUpdateRule={onUpdateRule}
            />
            <div className={classes.fullRowField}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Section IDs
              </Typography>
              {!isRuleInEditMode && (!rule.sectionIds || rule.sectionIds.length === 0) ? (
                <Typography variant="body2" color="textSecondary">
                  No section IDs
                </Typography>
              ) : (
                <SectionsEditor
                  label="Section IDs"
                  ids={rule.sectionIds ?? []}
                  onUpdate={(ids) => onUpdateRule(index, { ...rule, sectionIds: ids })}
                  disabled={!isRuleInEditMode}
                />
              )}
            </div>
            <div className={classes.fullRowField}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Tag IDs
              </Typography>
              {!isRuleInEditMode && (!rule.tagIds || rule.tagIds.length === 0) ? (
                <Typography variant="body2" color="textSecondary">
                  No tag IDs
                </Typography>
              ) : (
                <TagsEditor
                  label="Tag IDs"
                  ids={rule.tagIds ?? []}
                  onUpdate={(ids) => onUpdateRule(index, { ...rule, tagIds: ids })}
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
              value={rule.dateRange?.start ?? ''}
              onChange={(e) =>
                onUpdateRule(index, {
                  ...rule,
                  dateRange: e.target.value
                    ? { start: e.target.value, end: rule.dateRange?.end ?? '' }
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
              value={rule.dateRange?.end ?? ''}
              onChange={(e) =>
                onUpdateRule(index, {
                  ...rule,
                  dateRange: e.target.value
                    ? { start: rule.dateRange?.start ?? '', end: e.target.value }
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
    );
  };

  return (
    <div className={classes.container}>
      <Typography variant="h6" className={classes.sectionHeader}>
        {label}
      </Typography>

      <Button
        className={classes.addRuleButton}
        variant="outlined"
        size="small"
        startIcon={<AddIcon />}
        onClick={onAddRule}
        disabled={!canEdit}
      >
        Add rule
      </Button>

      {rules.length === 0 && (
        <Typography variant="body2" color="textSecondary">
          No rules defined.
        </Typography>
      )}

      {rules.map((rule, i) => renderRule(rule, i))}

      <Divider className={classes.bottomDivider} sx={{ mt: 3 }} />
    </div>
  );
};

export default ChannelExclusionsSection;
