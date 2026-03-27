import React from 'react';
import { IconButton, TextField, Typography, Theme } from '@mui/material';
import { makeStyles } from '@mui/styles';
import DeleteIcon from '@mui/icons-material/Delete';
import { ExclusionRule } from '../../models/exclusions';

const useStyles = makeStyles(({ spacing }: Theme) => ({
  ruleHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: spacing(2),
    alignItems: 'flex-start',
  },
  field: {
    flex: '1 0 200px',
  },
}));

interface RuleHeaderProps {
  rule: ExclusionRule;
  index: number;
  editMode: boolean;
  onUpdateRule: (index: number, rule: ExclusionRule) => void;
  onDeleteRule: (index: number) => void;
  touchedNameFields: Set<number>;
  onNameBlur: (index: number) => void;
}

const RuleHeader: React.FC<RuleHeaderProps> = ({
  rule,
  index,
  editMode,
  onUpdateRule,
  onDeleteRule,
  touchedNameFields,
  onNameBlur,
}) => {
  const classes = useStyles();

  return (
    <div className={classes.ruleHeader}>
      {editMode ? (
        <TextField
          className={classes.field}
          label="Rule Name"
          value={rule.name ?? ''}
          onChange={(e) => onUpdateRule(index, { ...rule, name: e.target.value })}
          onBlur={() => onNameBlur(index)}
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
  );
};

export default RuleHeader;
