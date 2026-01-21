import React, { useState, useEffect } from 'react';
import { makeStyles } from '@mui/styles';
import {
  TextField,
  Theme,
  IconButton,
  Box,
  Typography,
  Chip,
  CircularProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { fetchPromo, PromoResponse, fetchPromoCampaign } from '../../utils/requests';
import { Promo, PromoCampaign } from '../promoTool/utils/promoModels';

interface PromoCodesEditorProps {
  promoCodes: string[];
  updatePromoCodes: (promoCodes: string[]) => void;
  isDisabled: boolean;
  maxPromoCodes?: number;
}

interface PromoDetails {
  code: string;
  promo: Promo | null;
  campaign: PromoCampaign | null;
  loading: boolean;
  error: boolean;
}

const useStyles = makeStyles(({ spacing, palette }: Theme) => ({
  container: {
    '& > * + *': {
      marginTop: spacing(2),
    },
  },
  addPromoContainer: {
    display: 'flex',
    gap: spacing(1),
    alignItems: 'flex-start',
  },
  accordion: {
    marginBottom: spacing(1),
    '&:before': {
      display: 'none',
    },
  },
  accordionError: {
    backgroundColor: palette.error.light + '20',
    borderLeft: `4px solid ${palette.error.main}`,
  },
  accordionExpired: {
    backgroundColor: palette.warning.light + '20',
    borderLeft: `4px solid ${palette.warning.main}`,
  },
  accordionSummary: {
    '& .MuiAccordionSummary-content': {
      margin: `${spacing(1.5)} 0`,
      alignItems: 'center',
    },
  },
  promoHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  promoCodeContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: spacing(1),
  },
  promoCodeLabel: {
    fontSize: '0.75rem',
    color: palette.text.secondary,
    textTransform: 'uppercase',
    fontWeight: 500,
    letterSpacing: '0.5px',
  },
  promoCode: {
    fontWeight: 600,
    fontSize: '1rem',
    fontFamily: 'monospace',
  },
  promoInfo: {
    flex: 1,
  },
  promoDetail: {
    fontSize: '0.875rem',
    color: palette.text.secondary,
    marginBottom: spacing(0.25),
  },
  chipContainer: {
    display: 'flex',
    gap: spacing(0.5),
    flexWrap: 'wrap',
    marginTop: spacing(0.5),
  },
}));

const PromoCodesEditor: React.FC<PromoCodesEditorProps> = ({
  promoCodes,
  updatePromoCodes,
  isDisabled,
}) => {
  const classes = useStyles();
  const [newPromoCode, setNewPromoCode] = useState<string>('');
  const [promoDetails, setPromoDetails] = useState<Map<string, PromoDetails>>(new Map());
  const [addingPromo, setAddingPromo] = useState(false);
  const [expandedCodes, setExpandedCodes] = useState<Set<string>>(new Set());

  useEffect(() => {
    const loadPromoDetails = async () => {
      const newDetails = new Map<string, PromoDetails>();

      for (const code of promoCodes) {
        if (promoDetails.has(code)) {
          newDetails.set(code, promoDetails.get(code)!);
        } else {
          newDetails.set(code, {
            code,
            promo: null,
            campaign: null,
            loading: true,
            error: false,
          });

          fetchPromo(code)
            .then(async (response: PromoResponse) => {
              const promo = response.promo;
              let campaign: PromoCampaign | null = null;

              // Fetch campaign details
              try {
                campaign = await fetchPromoCampaign(promo.campaignCode);
              } catch (err) {
                console.error('Failed to fetch campaign:', err);
              }

              setPromoDetails(prev => {
                const updated = new Map(prev);
                updated.set(code, {
                  code,
                  promo,
                  campaign,
                  loading: false,
                  error: false,
                });
                return updated;
              });
            })
            .catch(() => {
              setPromoDetails(prev => {
                const updated = new Map(prev);
                updated.set(code, {
                  code,
                  promo: null,
                  campaign: null,
                  loading: false,
                  error: true,
                });
                return updated;
              });
            });
        }
      }

      setPromoDetails(newDetails);
    };

    loadPromoDetails();
  }, [promoCodes]);

  const handleAddPromo = async () => {
    const trimmedCode = newPromoCode.trim();
    if (!trimmedCode || promoCodes.includes(trimmedCode)) {
      return;
    }

    setAddingPromo(true);
    try {
      await fetchPromo(trimmedCode);
      updatePromoCodes([...promoCodes, trimmedCode]);
      setNewPromoCode('');
    } catch (error) {
      // Still add it but it will show as error
      updatePromoCodes([...promoCodes, trimmedCode]);
      setNewPromoCode('');
    } finally {
      setAddingPromo(false);
    }
  };

  const handleDeletePromo = (code: string) => {
    updatePromoCodes(promoCodes.filter(c => c !== code));
  };

  const handleAccordionChange = (code: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpandedCodes(prev => {
      const newSet = new Set(prev);
      if (isExpanded) {
        newSet.add(code);
      } else {
        newSet.delete(code);
      }
      return newSet;
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddPromo();
    }
  };

  const isExpired = (endTimestamp?: string): boolean => {
    if (!endTimestamp) {
      return false;
    }
    return new Date(endTimestamp) < new Date();
  };

  const formatDiscount = (promo: Promo): string => {
    if (!promo.discount) {
      return 'No discount';
    }
    const amount = promo.discount.amount ? `${promo.discount.amount}%` : '';
    const duration = promo.discount.durationMonths
      ? ` for ${promo.discount.durationMonths} month${promo.discount.durationMonths > 1 ? 's' : ''}`
      : '';
    return amount + duration || 'No discount details';
  };

  return (
    <div className={classes.container}>
      {promoCodes.map(code => {
        const details = promoDetails.get(code);
        const expired = details?.promo ? isExpired(details.promo.endTimestamp) : false;
        const hasError = details?.error;

        return (
          <Accordion
            key={code}
            className={`${classes.accordion} ${
              hasError ? classes.accordionError : expired ? classes.accordionExpired : ''
            }`}
            expanded={expandedCodes.has(code)}
            onChange={handleAccordionChange(code)}
            elevation={1}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              className={classes.accordionSummary}
            >
              <div className={classes.promoHeader}>
                <div className={classes.promoCodeContainer}>
                  <Typography className={classes.promoCodeLabel}>Promo Code:</Typography>
                  <Typography className={classes.promoCode}>{code}</Typography>
                  {expired && <Chip label="Expired" color="warning" size="small" />}
                </div>
                <IconButton
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeletePromo(code);
                  }}
                  disabled={isDisabled}
                  size="small"
                  color="error"
                >
                  <DeleteIcon />
                </IconButton>
              </div>
            </AccordionSummary>

            <AccordionDetails>
              {details?.loading ? (
                <Box display="flex" alignItems="center" gap={1}>
                  <CircularProgress size={16} />
                  <Typography variant="body2" color="textSecondary">
                    Loading details...
                  </Typography>
                </Box>
              ) : hasError ? (
                <Typography className={classes.promoDetail} color="error">
                  ⚠️ Invalid promo code - not found in system
                </Typography>
              ) : details?.promo ? (
                <Box>
                  <Typography className={classes.promoDetail}>
                    <strong>Name:</strong> {details.promo.name}
                  </Typography>
                  <Typography className={classes.promoDetail}>
                    <strong>Campaign:</strong>{' '}
                    {details.campaign?.name || details.promo.campaignCode}
                  </Typography>
                  <Typography className={classes.promoDetail}>
                    <strong>Discount:</strong> {formatDiscount(details.promo)}
                  </Typography>
                  {details.campaign && (
                    <Typography className={classes.promoDetail}>
                      <strong>Product:</strong> {details.campaign.product}
                    </Typography>
                  )}
                </Box>
              ) : null}
            </AccordionDetails>
          </Accordion>
        );
      })}

      <Box className={classes.addPromoContainer}>
        <TextField
          label="Add Promo Code"
          value={newPromoCode}
          onChange={e => setNewPromoCode(e.target.value.toUpperCase())}
          onKeyPress={handleKeyPress}
          disabled={isDisabled || addingPromo}
          placeholder="e.g. PROMO123"
          size="small"
          fullWidth
        />
        <IconButton
          onClick={handleAddPromo}
          disabled={isDisabled || !newPromoCode.trim() || addingPromo}
          color="primary"
        >
          {addingPromo ? <CircularProgress size={24} /> : <AddIcon />}
        </IconButton>
      </Box>
    </div>
  );
};

export default PromoCodesEditor;
