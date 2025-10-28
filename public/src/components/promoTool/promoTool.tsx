import { makeStyles } from '@mui/styles';
import { Theme } from '@mui/material';
import React, { useEffect, useState } from 'react';
import PromoCampaignsSidebar from './promoCampaignsSidebar';
import { PromoCampaign, PromoProduct, Promo } from './utils/promoModels';
import { useParams } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import {
  createPromoCampaign,
  fetchPromoCampaigns,
  fetchAllPromos,
  createPromo,
  lockPromo,
  unlockPromo,
  updatePromo,
} from '../../utils/requests';
import PromosList from './promosList';
import PromoEditor from './promoEditor';
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
  },
}));

const PromoTool: React.FC = () => {
  const classes = useStyles();

  const [promoCampaigns, setPromoCampaigns] = useState<PromoCampaign[]>([]);
  const [promos, setPromos] = useState<Promo[]>([]);
  const { promoCampaignCode } = useParams<{ promoCampaignCode?: string }>(); // querystring parameter
  const [selectedPromoCampaignCode, setSelectedPromoCampaignCode] = useState<string | undefined>();
  const [selectedPromoProduct, setSelectedPromoProduct] = useState<PromoProduct>('SupporterPlus');
  const [selectedPromoCode, setSelectedPromoCode] = useState<string | undefined>();
  const [isEditing, setIsEditing] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  const createNewPromoCampaign = (name: string, product: PromoProduct): void => {
    const newPromoCampaign: PromoCampaign = {
      campaignCode: uuidv4(),
      name: name,
      product: product,
      created: new Date().toISOString(),
    };

    createPromoCampaign(newPromoCampaign)
      .then(() => {
        setSelectedPromoCampaignCode(newPromoCampaign.campaignCode);
        setPromoCampaigns([newPromoCampaign, ...promoCampaigns]);
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
        countries: [],
      },
      startTimestamp: new Date().toISOString(),
      endTimestamp: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
      description: '',
    };

    createPromo(newPromo)
      .then(() => {
        setPromos([...promos, newPromo]);
        setSelectedPromoCode(promoCode);
      })
      .catch(error => {
        alert(`Error creating promo: ${error.message}`);
      });
  };

  const handleEditPromo = (): void => {
    if (selectedPromo) {
      lockPromo(selectedPromo.promoCode, false)
        .then(() => {
          setIsEditing(true);
          fetchPromosList(selectedPromoCampaignCode!);
        })
        .catch(error => {
          alert(`Error locking promo: ${error.message}`);
        });
    }
  };

  const handleLockPromo = (force: boolean): void => {
    if (selectedPromo) {
      lockPromo(selectedPromo.promoCode, force)
        .then(() => {
          setIsEditing(true);
          fetchPromosList(selectedPromoCampaignCode!);
        })
        .catch(error => {
          alert(`Error locking promo: ${error.message}`);
        });
    }
  };

  const handleUnlockPromo = (): void => {
    if (selectedPromo) {
      unlockPromo(selectedPromo.promoCode)
        .then(() => {
          setIsEditing(false);
          fetchPromosList(selectedPromoCampaignCode!);
        })
        .catch(error => {
          alert(`Error unlocking promo: ${error.message}`);
        });
    }
  };

  const handleSavePromo = (promo: Promo): void => {
    updatePromo(promo)
      .then(() => {
        setIsEditing(false);
        fetchPromosList(selectedPromoCampaignCode!);
      })
      .catch(error => {
        alert(`Error saving promo: ${error.message}`);
      });
  };

  const handleCancelEdit = (): void => {
    if (selectedPromo) {
      unlockPromo(selectedPromo.promoCode)
        .then(() => {
          setIsEditing(false);
          fetchPromosList(selectedPromoCampaignCode!);
        })
        .catch(error => {
          console.error('Error unlocking promo:', error);
          setIsEditing(false);
        });
    }
  };

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
      setSelectedPromoCode(undefined);
    } else {
      setPromos([]);
    }
  }, [selectedPromoCampaignCode]);

  const selectedPromoCampaign = promoCampaigns.find(
    a => a.campaignCode === selectedPromoCampaignCode,
  );

  const selectedPromo = promos.find(p => p.promoCode === selectedPromoCode);

  return (
    <div className={classes.body}>
      <div className={classes.leftCol}>
        <PromoCampaignsSidebar
          promoCampaigns={promoCampaigns}
          selectedPromoCampaign={selectedPromoCampaign}
          createPromoCampaign={createNewPromoCampaign}
          onPromoCampaignSelected={code => setSelectedPromoCampaignCode(code)}
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
              selectedPromo={selectedPromo}
              onPromoSelected={setSelectedPromoCode}
              onCreatePromo={() => setCreateDialogOpen(true)}
            />
            {selectedPromo && (
              <PromoEditor
                promo={selectedPromo}
                isEditing={isEditing}
                onSave={handleSavePromo}
                onCancel={handleCancelEdit}
                onEdit={handleEditPromo}
                onLock={handleLockPromo}
                onUnlock={handleUnlockPromo}
              />
            )}
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
    </div>
  );
};

export default PromoTool;
