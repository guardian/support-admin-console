import React from 'react';
import { Button, IconButton, TextField, Typography, Theme } from '@mui/material';
import { makeStyles } from '@mui/styles';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { ExclusionRule } from '../../models/exclusions';

const useStyles = makeStyles(({ spacing }: Theme) => ({
  ruleHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: spacing(2),
    alignItems: 'center',
    width: '100%',
  },
  field: {
    flex: '1 0 200px',
    position: 'relative',
  },
  fieldHelperText: {
    position: 'absolute',
    top: '100%',
    left: 0,
    margin: 0,
  },
  actionButtons: {
    display: 'flex',
    alignItems: 'center',
    gap: spacing(1),
  },
}));

interface RuleHeaderProps {
  rule: ExclusionRule;
  index: number;
  editMode: boolean;
  isUnsaved: boolean;
  canEdit: boolean;
  saving: boolean;
  onUpdateRule: (index: number, rule: ExclusionRule) => void;
  onStartEditRule: (index: number) => void;
  onSaveRule: () => void;
  onCancelRule: () => void;
  onDeleteRule: (index: number) => void;
  touchedNameFields: Set<number>;
  onNameBlur: (index: number) => void;
}

const RuleHeader: React.FC<RuleHeaderProps> = ({
  rule,
  index,
  editMode,
  isUnsaved,
  canEdit,
  saving,
  onUpdateRule,
  onStartEditRule,
  onSaveRule,
  onCancelRule,
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
          onClick={(e) => e.stopPropagation()}
          onChange={(e) => onUpdateRule(index, { ...rule, name: e.target.value })}
          onBlur={() => onNameBlur(index)}
          variant="outlined"
          size="small"
          required
          error={touchedNameFields.has(index) && !rule.name?.trim()}
          helperText={
            touchedNameFields.has(index) && !rule.name?.trim() ? 'Rule name is required' : ''
          }
          FormHelperTextProps={{ className: classes.fieldHelperText }}
          disabled={!editMode}
        />
      ) : (
        <div>
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
            {rule.name}
          </Typography>
          {isUnsaved && (
            <Typography variant="caption" color="warning.main">
              Unsaved
            </Typography>
          )}
        </div>
      )}
      <div className={classes.actionButtons}>
        {editMode ? (
          <>
            {isUnsaved && (
              <Typography variant="caption" color="warning.main">
                Unsaved
              </Typography>
            )}
            <Button
              size="small"
              variant="contained"
              onClick={(e) => {
                e.stopPropagation();
                onSaveRule();
              }}
              disabled={saving}
            >
              Save
            </Button>
            <Button
              size="small"
              variant="outlined"
              onClick={(e) => {
                e.stopPropagation();
                onCancelRule();
              }}
              disabled={saving}
            >
              Cancel
            </Button>
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                onDeleteRule(index);
              }}
              aria-label="Delete rule"
              disabled={!canEdit || saving}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </>
        ) : (
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              onStartEditRule(index);
            }}
            aria-label="Edit rule"
            disabled={!canEdit}
          >
            <EditIcon fontSize="small" />
          </IconButton>
        )}
      </div>
    </div>
  );
};

export default RuleHeader;
