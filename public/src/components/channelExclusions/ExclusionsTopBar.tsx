import React from 'react';
import { Button, Typography, Theme } from '@mui/material';
import { makeStyles } from '@mui/styles';
import EditIcon from '@mui/icons-material/Edit';

const useStyles = makeStyles(({ spacing }: Theme) => ({
  topBar: {
    display: 'flex',
    alignItems: 'center',
    gap: spacing(2),
    marginBottom: spacing(4),
  },
}));

interface ExclusionsTopBarProps {
  editMode: boolean;
  canEdit: boolean;
  saving: boolean;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
}

const ExclusionsTopBar: React.FC<ExclusionsTopBarProps> = ({
  editMode,
  canEdit,
  saving,
  onEdit,
  onSave,
  onCancel,
}) => {
  const classes = useStyles();

  return (
    <div className={classes.topBar}>
      {!editMode && canEdit && (
        <Button variant="outlined" startIcon={<EditIcon />} onClick={onEdit}>
          Edit
        </Button>
      )}
      {!editMode && !canEdit && (
        <Typography variant="body2" color="textSecondary">
          You do not have permission to edit exclusions.
        </Typography>
      )}
      {editMode && (
        <>
          <Button variant="contained" color="primary" disabled={saving} onClick={onSave}>
            {saving ? 'Saving...' : 'Save'}
          </Button>
          <Button variant="outlined" onClick={onCancel} disabled={saving}>
            Cancel
          </Button>
        </>
      )}
    </div>
  );
};

export default ExclusionsTopBar;
