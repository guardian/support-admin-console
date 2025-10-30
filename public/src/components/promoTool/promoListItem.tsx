import React from 'react';
import { ListItem, ListItemButton, ListItemText, Box, Chip, Button } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { Theme } from '@mui/material/styles';
import { Promo } from './utils/promoModels';

const useStyles = makeStyles(({ palette, spacing }: Theme) => ({
  listItem: {
    padding: 0,
    borderBottom: '1px solid #eee',
    '&:last-child': {
      borderBottom: 'none',
    },
  },
  listItemButton: {
    padding: '12px 16px',
    '&.Mui-selected': {
      backgroundColor: palette.primary.light,
      '&:hover': {
        backgroundColor: palette.primary.light,
      },
    },
  },
  promoCode: {
    fontWeight: 600,
    fontSize: '14px',
  },
  dates: {
    fontSize: '12px',
    color: palette.text.secondary,
  },
  actionButtons: {
    display: 'flex',
    gap: spacing(1),
  },
}));

interface PromoListItemProps {
  promo: Promo;
  onClonePromo: (promo: Promo) => void;
  onViewPromo: (promoCode: string) => void;
}

export const PromoListItem = ({
  promo,
  onClonePromo,
  onViewPromo,
}: PromoListItemProps): React.ReactElement => {
  const classes = useStyles();

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <ListItem className={classes.listItem} disablePadding>
      <ListItemButton className={classes.listItemButton}>
        <ListItemText
          primary={
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <span className={classes.promoCode}>{promo.promoCode}</span>
              <Box className={classes.actionButtons}>
                {promo.lockStatus?.locked && <Chip label="Locked" size="small" color="warning" />}
                <Button
                  size="small"
                  variant="outlined"
                  onClick={e => {
                    e.stopPropagation();
                    onClonePromo(promo);
                  }}
                >
                  Clone
                </Button>
                <Button
                  size="small"
                  variant="outlined"
                  onClick={e => {
                    e.stopPropagation();
                    onViewPromo(promo.promoCode);
                  }}
                >
                  View
                </Button>
              </Box>
            </Box>
          }
          secondary={
            <span className={classes.dates}>
              {formatDate(promo.startTimestamp)} - {formatDate(promo.endTimestamp)}
            </span>
          }
        />
      </ListItemButton>
    </ListItem>
  );
};
