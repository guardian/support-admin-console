import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { Button, IconButton, TextField, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import React, { useEffect, useRef } from 'react';
import { ExclusionRule } from '../../models/exclusions';

const RuleHeaderRoot = styled('div')(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  gap: theme.spacing(2),
  alignItems: 'center',
  width: '100%',
}));

const Field = styled(TextField)({
  flex: '1 0 200px',
  position: 'relative',
});

const fieldHelperTextSx = { position: 'absolute', top: '100%', left: 0, m: 0 } as const;

const ActionButtons = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
}));

interface RuleHeaderState {
  rule: ExclusionRule;
  index: number;
  editMode: boolean;
  isUnsaved: boolean;
  canEdit: boolean;
  saving: boolean;
  touchedNameFields: Set<number>;
}

interface RuleHeaderHandlers {
  onUpdateRule: (index: number, rule: ExclusionRule) => void;
  onStartEditRule: () => void;
  onSaveRule: () => void;
  onCancelRule: () => void;
  onDeleteRule: () => void;
  onNameBlur: () => void;
}

interface RuleHeaderProps {
  state: RuleHeaderState;
  handlers: RuleHeaderHandlers;
}

const RuleHeader: React.FC<RuleHeaderProps> = ({ state, handlers }) => {
  const { rule, index, editMode, isUnsaved, canEdit, saving, touchedNameFields } = state;
  const { onUpdateRule, onStartEditRule, onSaveRule, onCancelRule, onDeleteRule, onNameBlur } =
    handlers;
  const nameInputRef = useRef<HTMLInputElement | null>(null);
  const hasAutoFocusedRef = useRef(false);

  useEffect(() => {
    if (!editMode || rule.name.trim()) {
      hasAutoFocusedRef.current = false;
      return;
    }
    if (hasAutoFocusedRef.current) {
      return;
    }
    hasAutoFocusedRef.current = true;
    const input = nameInputRef.current;
    if (!input) {
      return;
    }
    input.focus();
    input.select();
  }, [editMode, rule.name]);

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const userConfirmation = confirm(
      `Are you sure you want to delete the rule "${rule.name}"? This action cannot be undone.`,
    );
    if (userConfirmation) {
      onDeleteRule();
    }
  };

  return (
    <RuleHeaderRoot>
      {editMode ? (
        <Field
          label="Rule Name"
          value={rule.name}
          inputRef={nameInputRef}
          onClick={(e) => e.stopPropagation()}
          onChange={(e) => onUpdateRule(index, { ...rule, name: e.target.value })}
          onBlur={onNameBlur}
          variant="outlined"
          size="small"
          required
          error={touchedNameFields.has(index) && !rule.name.trim()}
          helperText={
            touchedNameFields.has(index) && !rule.name.trim() ? 'Rule name is required' : ''
          }
          FormHelperTextProps={{ sx: fieldHelperTextSx }}
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
      <ActionButtons>
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
              onClick={handleDeleteClick}
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
              onStartEditRule();
            }}
            aria-label="Edit rule"
            disabled={!canEdit}
          >
            <EditIcon fontSize="small" />
          </IconButton>
        )}
      </ActionButtons>
    </RuleHeaderRoot>
  );
};

export default RuleHeader;
