import { makeStyles } from '@mui/styles';
import { Theme } from '@mui/material';
import React, { useEffect, useState } from 'react';
import PromoCampaignsSidebar from './promoCampaignsSidebar';
import { PromoCampaign, PromoProduct, Promo, promoProductNames } from './utils/promoModels';
import { useParams, useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import {
  createPromoCampaign,
  fetchPromoCampaigns,
  fetchAllPromos,
  createPromo,
} from '../../utils/requests';
import PromosList from './promosList';
import CreatePromoDialog from './createPromoDialog';

const useStyles = makeStyles(({ spacing, typography }: Theme) => ({
  viewTextContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: '-50px',
  },
  viewText: {
    fontSize: typography.pxToRem(16),
  },
  body: {
    display: 'flex',
    overflow: 'hidden',
    flexGrow: 1,
    width: '100%',
    height: '100%',
  },
  headline2: {
    color: '#555',
    fontSize: 18,
  },
  leftCol: {
    height: '100%',
    flexShrink: 0,
    overflowY: 'auto',
    background: 'white',
    paddingTop: spacing(6),
    paddingLeft: spacing(6),
    paddingRight: spacing(6),
  },
  rightCol: {
    flexGrow: 1,
    display: 'flex',
    justifyContent: 'center',
    overflowY: 'auto',
  },
}));

const PromoTool: React.FC = () => {
  const classes = useStyles();
  const navigate = useNavigate();

  const [promoCampaigns, setPromoCampaigns] = useState<PromoCampaign[]>([]);
  const [promos, setPromos] = useState<Promo[]>([]);
  const { campaignCode: promoCampaignCode } = useParams<{ campaignCode?: string }>();
  const [selectedPromoCampaignCode, setSelectedPromoCampaignCode] = useState<string | undefined>();
  const [selectedPromoProduct, setSelectedPromoProduct] = useState<PromoProduct>(() => {
    if (typeof window === 'undefined') {
      return 'SupporterPlus';
    }
    const stored = window.localStorage.getItem('promoToolSelectedProduct');
    const validProducts = Object.keys(promoProductNames) as PromoProduct[];
    return stored && (validProducts as string[]).includes(stored)
      ? (stored as PromoProduct)
      : 'SupporterPlus';
  });
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [cloneDialogOpen, setCloneDialogOpen] = useState(false);
  const [promoToClone, setPromoToClone] = useState<Promo | undefined>();

  const createNewPromoCampaign = (name: string, product: PromoProduct): void => {
    const newPromoCampaign: PromoCampaign = {
      campaignCode: uuidv4(),
      name: name,
      product: product,
      created: new Date().toISOString(),
    };

    createPromoCampaign(newPromoCampaign)
      .then(() => {
        fetchPromoCampaignsList(product); // Refetch campaigns list to update the sidebar
        navigate(`/promo-tool/${newPromoCampaign.campaignCode}`);
      })
      .catch(error => {
        alert(`Error while saving new PromoCampaign: ${error}`);
      });
  };

  const fetchPromoCampaignsList = (product: string): void => {
    fetchPromoCampaigns(JSON.stringify(product))
      .then(campaigns => {
        setPromoCampaigns(campaigns);
      })
      .catch(error => {
        console.error(error);
      });
  };

  const fetchPromosList = (campaignCode: string): void => {
    fetchAllPromos(campaignCode)
      .then(fetchedPromos => {
        setPromos(fetchedPromos);
      })
      .catch(error => {
        console.error('Error fetching promos:', error);
        alert(`Error fetching promos: ${error.message}`);
      });
  };

  const handleCreatePromo = (promoCode: string, name: string): void => {
    if (!selectedPromoCampaignCode) {
      alert('Please select a campaign first');
      return;
    }

    const newPromo: Promo = {
      promoCode,
      name,
      campaignCode: selectedPromoCampaignCode,
      appliesTo: {
        productRatePlanIds: [],
        countryGroups: [],
      },
      startTimestamp: new Date().toISOString(),
      description: '',
    };

    createPromo(newPromo)
      .then(() => {
        setPromos([...promos, newPromo]);
        // Navigate to the editor page
        navigate(`/promo-tool/${selectedPromoCampaignCode}/${promoCode}`);
      })
      .catch(error => {
        alert(`Error creating promo: ${error.message}`);
      });
  };

  const handleClonePromo = (promoCode: string, name: string): void => {
    if (!promoToClone) {
      return;
    }

    const clonedPromo: Promo = {
      ...promoToClone,
      promoCode,
      name,
    };

    createPromo(clonedPromo)
      .then(() => {
        setPromos([...promos, clonedPromo]);
        setPromoToClone(undefined);
        // Navigate to the editor page
        navigate(`/promo-tool/${selectedPromoCampaignCode}/${promoCode}`);
      })
      .catch(error => {
        alert(`Error cloning promo: ${error.message}`);
      });
  };

  const handleOpenCloneDialog = (promo: Promo): void => {
    setPromoToClone(promo);
    setCloneDialogOpen(true);
  };

  const handleViewPromo = (promoCode: string): void => {
    navigate(`/promo-tool/${selectedPromoCampaignCode}/${promoCode}`);
  };

  const handlePromoCampaignSelected = (campaignCode: string): void => {
    navigate(`/promo-tool/${campaignCode}`);
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('promoToolSelectedProduct', selectedPromoProduct);
    }
  }, [selectedPromoProduct]);

  // set selected promoCampaign
  useEffect(() => {
    if (promoCampaignCode != null) {
      setSelectedPromoCampaignCode(promoCampaignCode);
    }
  }, [promoCampaignCode, promoCampaigns]);

  useEffect(() => {
    fetchPromoCampaignsList(selectedPromoProduct);
  }, [selectedPromoProduct]);

  useEffect(() => {
    if (selectedPromoCampaignCode) {
      fetchPromosList(selectedPromoCampaignCode);
    } else {
      setPromos([]);
    }
  }, [selectedPromoCampaignCode]);

  const selectedPromoCampaign = promoCampaigns.find(
    a => a.campaignCode === selectedPromoCampaignCode,
  );

  return (
    <div className={classes.body}>
      <div className={classes.leftCol}>
        <PromoCampaignsSidebar
          promoCampaigns={promoCampaigns}
          selectedPromoCampaign={selectedPromoCampaign}
          createPromoCampaign={createNewPromoCampaign}
          onPromoCampaignSelected={handlePromoCampaignSelected}
          selectedProduct={selectedPromoProduct}
          setSelectedProduct={setSelectedPromoProduct}
        />
      </div>
      <div className={classes.rightCol}>
        {selectedPromoCampaign ? (
          <div style={{ width: '100%', padding: '24px' }}>
            <h2 className={classes.headline2}>Promo codes for {selectedPromoCampaign.name}</h2>
            <PromosList
              promos={promos}
              onCreatePromo={() => setCreateDialogOpen(true)}
              onClonePromo={handleOpenCloneDialog}
              onViewPromo={handleViewPromo}
            />
          </div>
        ) : (
          <div className={classes.viewTextContainer}>
            <p className={classes.viewText}>Select a campaign to view promo codes</p>
          </div>
        )}
      </div>
      <CreatePromoDialog
        open={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
        onCreate={handleCreatePromo}
        existingCodes={promos.map(p => p.promoCode)}
      />
      <CreatePromoDialog
        open={cloneDialogOpen}
        onClose={() => {
          setCloneDialogOpen(false);
          setPromoToClone(undefined);
        }}
        onCreate={handleClonePromo}
        existingCodes={promos.map(p => p.promoCode)}
      />
    </div>
  );
};

export default PromoTool;
