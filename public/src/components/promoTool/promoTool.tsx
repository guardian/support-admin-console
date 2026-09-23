import { styled } from '@mui/material/styles';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { hasPermission } from '../../utils/permissions';
import {
  createPromo,
  createPromoCampaign,
  fetchAllPromos,
  fetchCountryGroups,
  fetchProductDetails,
  fetchPromoCampaigns,
} from '../../utils/requests';
import CreatePromoDialog from './createPromoDialog';
import PromoCampaignsSidebar from './promoCampaignsSidebar';
import PromosList from './promosList';
import { getAllRatePlansWithProduct, RatePlanWithProduct } from './utils/productCatalog';
import {
  CountryGroup,
  mapPromoProductToCatalogProducts,
  Promo,
  PromoCampaign,
  PromoProduct,
  promoProductNames,
} from './utils/promoModels';

const ViewTextContainer = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  marginTop: '-50px',
});
const ViewText = styled('p')(({ theme }) => ({
  fontSize: theme.typography.pxToRem(16),
}));
const Body = styled('div')({
  display: 'flex',
  overflow: 'hidden',
  flexGrow: 1,
  width: '100%',
  height: '100%',
});
const Headline = styled('h2')({ color: '#555', fontSize: 18 });
const LeftCol = styled('div')(({ theme }) => ({
  height: '100%',
  flexShrink: 0,
  overflowY: 'auto',
  background: 'white',
  paddingTop: theme.spacing(6),
  paddingLeft: theme.spacing(6),
  paddingRight: theme.spacing(6),
}));
const RightCol = styled('div')({
  flexGrow: 1,
  display: 'flex',
  justifyContent: 'center',
  overflowY: 'auto',
});

const PromoTool: React.FC = () => {
  const navigate = useNavigate();
  const [promoCampaigns, setPromoCampaigns] = useState<PromoCampaign[]>([]);
  const [promos, setPromos] = useState<Promo[]>([]);
  const [countryGroups, setCountryGroups] = useState<CountryGroup[]>([]);
  const [ratePlans, setRatePlans] = useState<RatePlanWithProduct[]>([]);
  const { campaignCode: promoCampaignCode } = useParams<{ campaignCode?: string }>();
  const [selectedPromoProduct, setSelectedPromoProduct] = useState<PromoProduct>(() => {
    const stored = globalThis.window.localStorage.getItem('promoToolSelectedProduct');
    const validProducts = Object.keys(promoProductNames) as PromoProduct[];
    return stored && (validProducts as string[]).includes(stored)
      ? (stored as PromoProduct)
      : 'SupporterPlus';
  });
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [cloneDialogOpen, setCloneDialogOpen] = useState(false);
  const [promoToClone, setPromoToClone] = useState<Promo | undefined>();
  const allowEditing = hasPermission('promos-tool', 'Write');

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
        void navigate(`/promo-tool/campaign/${newPromoCampaign.campaignCode}`);
      })
      .catch((error) => {
        alert(`Error while saving new PromoCampaign: ${error}`);
      });
  };

  const fetchPromoCampaignsList = (product: string): void => {
    fetchPromoCampaigns(JSON.stringify(product))
      .then((campaigns) => {
        setPromoCampaigns(campaigns);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const fetchPromosList = (campaignCode: string): void => {
    fetchAllPromos(campaignCode)
      .then((fetchedPromos) => {
        setPromos(fetchedPromos);
      })
      .catch((error: unknown) => {
        console.error('Error fetching promos:', error);
        alert(`Error fetching promos: ${error instanceof Error ? error.message : String(error)}`);
      });
  };

  const handleCreatePromo = (promoCode: string, name: string): void => {
    if (!promoCampaignCode) {
      alert('Please select a campaign first');
      return;
    }

    const newPromo: Promo = {
      promoCode,
      name,
      campaignCode: promoCampaignCode,
      appliesTo: {
        productRatePlanIds: [],
        countries: [],
      },
      startTimestamp: new Date().toISOString(),
      description: '',
    };

    createPromo(newPromo)
      .then(() => {
        setPromos([...promos, newPromo]);
        // Navigate to the editor page
        void navigate(`/promo-tool/promo/${promoCode}`);
      })
      .catch((error: unknown) => {
        alert(`Error creating promo: ${error instanceof Error ? error.message : String(error)}`);
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
        void navigate(`/promo-tool/promo/${promoCode}`);
      })
      .catch((error: unknown) => {
        alert(`Error cloning promo: ${error instanceof Error ? error.message : String(error)}`);
      });
  };

  const handleOpenCloneDialog = (promo: Promo): void => {
    setPromoToClone(promo);
    setCloneDialogOpen(true);
  };

  const handleViewPromo = (promoCode: string): void => {
    void navigate(`/promo-tool/promo/${promoCode}`);
  };

  const handlePromoCampaignSelected = (campaignCode: string): void => {
    void navigate(`/promo-tool/campaign/${campaignCode}`);
  };

  useEffect(() => {
    globalThis.window.localStorage.setItem('promoToolSelectedProduct', selectedPromoProduct);
  }, [selectedPromoProduct]);

  useEffect(() => {
    fetchPromoCampaignsList(selectedPromoProduct);
  }, [selectedPromoProduct]);

  useEffect(() => {
    fetchCountryGroups()
      .then(setCountryGroups)
      .catch((error) => {
        console.error('Error fetching country groups:', error);
      });

    const catalogProducts = mapPromoProductToCatalogProducts(selectedPromoProduct);
    const fetchPromises = catalogProducts.map((catalogProduct) => {
      return fetchProductDetails(catalogProduct)
        .then((product) => {
          return getAllRatePlansWithProduct(product, catalogProduct);
        })
        .catch((error) => {
          console.error(`Error fetching rate plans for ${catalogProduct}:`, error);
          return [];
        });
    });

    Promise.all(fetchPromises)
      .then((allRatePlansArrays) => {
        const combinedRatePlans = allRatePlansArrays.flat();
        setRatePlans(combinedRatePlans);
      })
      .catch((error) => {
        console.error('Error combining rate plans:', error);
        setRatePlans([]);
      });
  }, [selectedPromoProduct]);

  useEffect(() => {
    if (promoCampaignCode) {
      fetchPromosList(promoCampaignCode);
    }
  }, [promoCampaignCode]);

  const selectedPromoCampaign = promoCampaigns.find(
    (promoCampaign) => promoCampaign.campaignCode === promoCampaignCode,
  );

  return (
    <Body>
      <LeftCol>
        <PromoCampaignsSidebar
          promoCampaigns={promoCampaigns}
          selectedPromoCampaign={selectedPromoCampaign}
          createPromoCampaign={createNewPromoCampaign}
          onPromoCampaignSelected={handlePromoCampaignSelected}
          selectedProduct={selectedPromoProduct}
          setSelectedProduct={setSelectedPromoProduct}
          allowEditing={allowEditing}
        />
      </LeftCol>
      <RightCol>
        {selectedPromoCampaign ? (
          <div style={{ width: '100%', padding: '24px' }}>
            <Headline>Promo codes for {selectedPromoCampaign.name}</Headline>
            <PromosList
              promos={promos}
              onCreatePromo={() => setCreateDialogOpen(true)}
              onClonePromo={handleOpenCloneDialog}
              onViewPromo={handleViewPromo}
              countryGroups={countryGroups}
              ratePlans={ratePlans}
              allowEditing={allowEditing}
            />
          </div>
        ) : (
          <ViewTextContainer>
            <ViewText>Select a campaign to view promo codes</ViewText>
          </ViewTextContainer>
        )}
      </RightCol>
      <CreatePromoDialog
        open={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
        onCreate={handleCreatePromo}
        existingCodes={promos.map((p) => p.promoCode)}
      />
      <CreatePromoDialog
        open={cloneDialogOpen}
        onClose={() => {
          setCloneDialogOpen(false);
          setPromoToClone(undefined);
        }}
        onCreate={handleClonePromo}
        existingCodes={promos.map((p) => p.promoCode)}
      />
    </Body>
  );
};

export default PromoTool;
