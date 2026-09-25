import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Chip,
  CircularProgress,
  IconButton,
  TextField,
  Typography,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { fetchPromo, fetchPromoCampaign, PromoResponse } from '../../utils/requests';
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

const Container = styled('div')(({ theme }) => ({
  '& > * + *': { marginTop: theme.spacing(2) },
}));
const AddPromoContainer = styled('div')(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(1),
  alignItems: 'flex-start',
}));
const StyledAccordion = styled(Accordion, {
  shouldForwardProp: (prop) => prop !== 'hasError' && prop !== 'expired',
})<{ hasError: boolean; expired: boolean }>(({ theme, hasError, expired }) => ({
  marginBottom: theme.spacing(1),
  '&:before': { display: 'none' },
  ...(hasError && {
    backgroundColor: `${theme.palette.error.light}20`,
    borderLeft: `4px solid ${theme.palette.error.main}`,
  }),
  ...(expired &&
    !hasError && {
      backgroundColor: `${theme.palette.warning.light}20`,
      borderLeft: `4px solid ${theme.palette.warning.main}`,
    }),
}));
const AccordionSummaryStyled = styled(AccordionSummary)(({ theme }) => ({
  '& .MuiAccordionSummary-content': {
    margin: `${theme.spacing(1.5)} 0`,
    alignItems: 'center',
  },
}));
const PromoHeader = styled('div')({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  width: '100%',
});
const PromoCodeContainer = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
}));
const PromoCodeLabel = styled(Typography)(({ theme }) => ({
  fontSize: '0.75rem',
  color: theme.palette.text.secondary,
  textTransform: 'uppercase',
  fontWeight: 500,
  letterSpacing: '0.5px',
}));
const PromoCode = styled(Typography)({
  fontWeight: 600,
  fontSize: '1rem',
  fontFamily: 'monospace',
});
const PromoDetail = styled(Typography)(({ theme }) => ({
  fontSize: '0.875rem',
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(0.25),
}));

const PromoCodesEditor: React.FC<PromoCodesEditorProps> = ({
  promoCodes,
  updatePromoCodes,
  isDisabled,
  maxPromoCodes,
}) => {
  const [newPromoCode, setNewPromoCode] = useState('');
  const [fetchedDetails, setFetchedDetails] = useState<Map<string, PromoDetails>>(new Map());
  const [addingPromo, setAddingPromo] = useState(false);
  const [expandedCodes, setExpandedCodes] = useState<Set<string>>(new Set());
  const requestedPromoCodesRef = useRef<Set<string>>(new Set());

  const promoDetails = useMemo(() => {
    const map = new Map<string, PromoDetails>();
    for (const code of promoCodes) {
      const fetched = fetchedDetails.get(code);
      map.set(code, fetched ?? { code, promo: null, campaign: null, loading: true, error: false });
    }
    return map;
  }, [promoCodes, fetchedDetails]);

  useEffect(() => {
    const promoCodeSet = new Set(promoCodes);
    requestedPromoCodesRef.current.forEach((code) => {
      if (!promoCodeSet.has(code)) {
        requestedPromoCodesRef.current.delete(code);
      }
    });

    const codesToFetch = promoCodes.filter((code) => !requestedPromoCodesRef.current.has(code));
    codesToFetch.forEach((code) => requestedPromoCodesRef.current.add(code));

    for (const code of codesToFetch) {
      void fetchPromo(code)
        .then(async (response: PromoResponse) => {
          let campaign: PromoCampaign | null = null;
          try {
            campaign = await fetchPromoCampaign(response.promo.campaignCode);
          } catch (error) {
            console.error('Failed to fetch campaign:', error);
          }
          setFetchedDetails((previous) => {
            const updated = new Map(previous);
            updated.set(code, {
              code,
              promo: response.promo,
              campaign,
              loading: false,
              error: false,
            });
            return updated;
          });
        })
        .catch(() => {
          setFetchedDetails((previous) => {
            const updated = new Map(previous);
            updated.set(code, { code, promo: null, campaign: null, loading: false, error: true });
            return updated;
          });
        });
    }
  }, [promoCodes]);

  const handleAddPromo = () => {
    const trimmedCode = newPromoCode.trim();
    if (!trimmedCode || promoCodes.includes(trimmedCode)) {
      return;
    }
    setAddingPromo(true);
    try {
      updatePromoCodes([...promoCodes, trimmedCode]);
    } finally {
      setNewPromoCode('');
      setAddingPromo(false);
    }
  };

  const handleDeletePromo = (code: string) => {
    updatePromoCodes(promoCodes.filter((currentCode) => currentCode !== code));
  };

  const handleAccordionChange =
    (code: string) => (_event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpandedCodes((current) => {
        const next = new Set(current);
        if (isExpanded) {
          next.add(code);
        } else {
          next.delete(code);
        }
        return next;
      });
    };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      void handleAddPromo();
    }
  };

  const isExpired = (endTimestamp?: string): boolean =>
    endTimestamp ? new Date(endTimestamp) < new Date() : false;

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

  const atPromoCodesLimit = maxPromoCodes !== undefined && promoCodes.length >= maxPromoCodes;

  return (
    <Container>
      {promoCodes.map((code) => {
        const details = promoDetails.get(code);
        const expired = details?.promo ? isExpired(details.promo.endTimestamp) : false;
        const hasError = details?.error ?? false;
        return (
          <StyledAccordion
            key={code}
            hasError={hasError}
            expired={expired}
            expanded={expandedCodes.has(code)}
            onChange={handleAccordionChange(code)}
            elevation={1}
          >
            <AccordionSummaryStyled expandIcon={<ExpandMoreIcon />}>
              <PromoHeader>
                <PromoCodeContainer>
                  <PromoCodeLabel>Promo Code:</PromoCodeLabel>
                  <PromoCode>{code}</PromoCode>
                  {expired && <Chip label="Expired" color="warning" size="small" />}
                </PromoCodeContainer>
                <IconButton
                  onClick={(event) => {
                    event.stopPropagation();
                    handleDeletePromo(code);
                  }}
                  disabled={isDisabled}
                  size="small"
                  color="error"
                >
                  <DeleteIcon />
                </IconButton>
              </PromoHeader>
            </AccordionSummaryStyled>
            <AccordionDetails>
              {details?.loading ? (
                <Box display="flex" alignItems="center" gap={1}>
                  <CircularProgress size={16} />
                  <Typography variant="body2" color="textSecondary">
                    Loading details...
                  </Typography>
                </Box>
              ) : hasError ? (
                <PromoDetail color="error">Invalid promo code - not found in system</PromoDetail>
              ) : details?.promo ? (
                <Box>
                  <PromoDetail>
                    <strong>Name:</strong> {details.promo.name}
                  </PromoDetail>
                  <PromoDetail>
                    <strong>Campaign:</strong>{' '}
                    {details.campaign?.name ?? details.promo.campaignCode}
                  </PromoDetail>
                  <PromoDetail>
                    <strong>Discount:</strong> {formatDiscount(details.promo)}
                  </PromoDetail>
                  {details.campaign && (
                    <PromoDetail>
                      <strong>Product:</strong> {details.campaign.product}
                    </PromoDetail>
                  )}
                </Box>
              ) : null}
            </AccordionDetails>
          </StyledAccordion>
        );
      })}
      <AddPromoContainer>
        <TextField
          label="Add Promo Code"
          value={newPromoCode}
          onChange={(event) => setNewPromoCode(event.target.value.toUpperCase())}
          onKeyDown={handleKeyDown}
          disabled={isDisabled || addingPromo || atPromoCodesLimit}
          placeholder="e.g. PROMO123"
          size="small"
          fullWidth
        />
        <IconButton
          onClick={() => void handleAddPromo()}
          disabled={isDisabled || !newPromoCode.trim() || addingPromo || atPromoCodesLimit}
          color="primary"
        >
          {addingPromo ? <CircularProgress size={24} /> : <AddIcon />}
        </IconButton>
      </AddPromoContainer>
    </Container>
  );
};

export default PromoCodesEditor;
