import React, { useState } from 'react';
import {
  Button,
  Divider,
  IconButton,
  TextField,
  Typography,
  Theme,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  Box,
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { SectionsEditor } from '../channelManagement/epicTests/sectionsEditor';
import { TagsEditor } from '../channelManagement/epicTests/tagsEditor';
import { ExclusionRule } from '../../models/exclusions';

const useStyles = makeStyles(({ spacing, palette }: Theme) => ({
  sectionHeader: {
    marginBottom: spacing(2),
    textTransform: 'capitalize',
  },
  ruleCard: {
    border: `1px solid ${palette.divider}`,
    borderRadius: spacing(1),
    padding: spacing(2),
    marginBottom: spacing(2),
    display: 'flex',
    flexDirection: 'column',
    gap: spacing(1),
  },
  ruleHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: spacing(2),
    alignItems: 'center',
  },
  ruleFields: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: spacing(2),
  },
  field: {
    flex: '1 0 200px',
  },
  dateRange: {
    display: 'flex',
    gap: spacing(2),
    flex: '1 1 100%',
  },
  addRuleButton: {
    marginTop: spacing(1),
  },
  contentTypeSection: {
    flex: '1 1 100%',
  },
}));

interface ChannelExclusionsSectionProps {
  channel: string;
  label: string;
  rules: ExclusionRule[];
  editMode: boolean;
  onUpdateRule: (index: number, rule: ExclusionRule) => void;
  onDeleteRule: (index: number) => void;
  onAddRule: () => void;
}

const ChannelExclusionsSection: React.FC<ChannelExclusionsSectionProps> = ({
  label,
  rules,
  editMode,
  onUpdateRule,
  onDeleteRule,
  onAddRule,
}) => {
  const classes = useStyles();
  const [touchedNameFields, setTouchedNameFields] = useState<Set<number>>(new Set());

  const handleNameBlur = (index: number) => {
    setTouchedNameFields((prev) => new Set(prev).add(index));
  };

  const renderRule = (rule: ExclusionRule, index: number) => (
    <div key={index} className={classes.ruleCard}>
      <div className={classes.ruleHeader}>
        {editMode ? (
          <TextField
            className={classes.field}
            label="Rule Name"
            value={rule.name ?? ''}
            onChange={(e) => onUpdateRule(index, { ...rule, name: e.target.value })}
            onBlur={() => handleNameBlur(index)}
            variant="outlined"
            size="small"
            required
            error={touchedNameFields.has(index) && !rule.name?.trim()}
            helperText={
              touchedNameFields.has(index) && !rule.name?.trim() ? 'Rule name is required' : ' '
            }
            disabled={!editMode}
          />
        ) : (
          <Typography variant="subtitle1">{rule.name}</Typography>
        )}
        <IconButton
          size="small"
          onClick={() => onDeleteRule(index)}
          aria-label="Delete rule"
          disabled={!editMode}
        >
          <DeleteIcon fontSize="small" />
        </IconButton>
      </div>

      <div className={classes.ruleFields}>
        <Box className={classes.contentTypeSection}>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            Content Types
          </Typography>
          <FormControl disabled={!editMode}>
            <RadioGroup
              row
              value={
                rule.contentTypes === undefined ||
                (rule.contentTypes.length === 2 &&
                  rule.contentTypes.includes('Fronts') &&
                  rule.contentTypes.includes('Articles'))
                  ? 'both'
                  : rule.contentTypes?.length === 1 && rule.contentTypes.includes('Fronts')
                    ? 'fronts'
                    : 'articles'
              }
              onChange={(e) => {
                const value = e.target.value;
                if (value === 'fronts') {
                  onUpdateRule(index, { ...rule, contentTypes: ['Fronts'] });
                } else if (value === 'articles') {
                  onUpdateRule(index, { ...rule, contentTypes: ['Articles'] });
                } else {
                  onUpdateRule(index, { ...rule, contentTypes: ['Fronts', 'Articles'] });
                }
              }}
            >
              <FormControlLabel value="fronts" control={<Radio />} label="Fronts" />
              <FormControlLabel value="articles" control={<Radio />} label="Articles" />
              <FormControlLabel value="both" control={<Radio />} label="Fronts & Articles" />
            </RadioGroup>
          </FormControl>
        </Box>
        <div className={classes.field}>
          <SectionsEditor
            label="Section IDs"
            ids={rule.sectionIds ?? []}
            onUpdate={(ids) => onUpdateRule(index, { ...rule, sectionIds: ids })}
            disabled={!editMode}
          />
        </div>
        <div className={classes.field}>
          <TagsEditor
            label="Tag IDs"
            ids={rule.tagIds ?? []}
            onUpdate={(ids) => onUpdateRule(index, { ...rule, tagIds: ids })}
            disabled={!editMode}
          />
        </div>
      </div>

      <div className={classes.dateRange}>
        <TextField
          className={classes.field}
          label="Start Date"
          type="datetime-local"
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
          disabled={!editMode}
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
          disabled={!editMode}
          InputLabelProps={{
            shrink: true,
          }}
        />
      </div>
    </div>
  );

  return (
    <div>
      <Typography variant="h6" className={classes.sectionHeader}>
        {label}
      </Typography>

      {rules.length === 0 && (
        <Typography variant="body2" color="textSecondary">
          No rules defined.
        </Typography>
      )}

      {rules.map((rule, i) => renderRule(rule, i))}

      <Button
        className={classes.addRuleButton}
        variant="outlined"
        size="small"
        startIcon={<AddIcon />}
        onClick={onAddRule}
        disabled={!editMode}
      >
        Add rule
      </Button>

      <Divider sx={{ mt: 3 }} />
    </div>
  );
};

export default ChannelExclusionsSection;
