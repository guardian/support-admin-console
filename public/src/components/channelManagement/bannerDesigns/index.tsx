import { Box, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { BannerDesign } from '../../../models/bannerDesign';
import { Status } from '../../../models/bannerDesign';
import {
  archiveBannerDesign,
  BannerDesignsResponse,
  createBannerDesign,
  fetchBannerDesign,
  fetchFrontendSettings,
  FrontendSettingsType,
  lockBannerDesign,
  unlockBannerDesign,
  updateBannerDesign,
  updateBannerDesignStatus,
} from '../../../utils/requests';
import BannerDesignEditor from './BannerDesignEditor';
import BannerDesignsSidebar from './BannerDesignsSidebar';
import { createDefaultBannerDesign } from './utils/defaults';

const ViewTextContainer = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  marginTop: '-50px',
});

const ViewText = styled(Typography)(({ theme }) => ({
  fontSize: theme.typography.pxToRem(16),
}));

const Body = styled(Box)({
  display: 'flex',
  overflow: 'hidden',
  flexGrow: 1,
  width: '100%',
  height: '100%',
});

const LeftCol = styled(Box)(({ theme }) => ({
  height: '100%',
  flexShrink: 0,
  overflowY: 'auto',
  background: 'white',
  paddingTop: theme.spacing(6),
  paddingLeft: theme.spacing(6),
  paddingRight: theme.spacing(6),
}));

const RightCol = styled(Box)({
  flexGrow: 1,
  display: 'flex',
  justifyContent: 'center',
});

const BannerDesigns: React.FC = () => {
  const [bannerDesigns, setBannerDesigns] = useState<BannerDesign[]>([]);
  const { bannerDesignName } = useParams<{ bannerDesignName?: string }>(); // querystring parameter
  const [selectedBannerDesignName, setSelectedBannerDesignName] = useState<string | undefined>(
    bannerDesignName,
  );
  const [userEmail, setUserEmail] = useState<string>('');

  const refreshDesigns = () => {
    void fetchFrontendSettings(FrontendSettingsType.BannerDesigns).then(
      (response: BannerDesignsResponse) => {
        setBannerDesigns(response.bannerDesigns);
        setUserEmail(response.userEmail);
      },
    );
  };

  useEffect(() => {
    refreshDesigns();
  }, []);

  const createDesign = (name: string): void => {
    const design = {
      ...createDefaultBannerDesign(name),
      isNew: true,
      lockStatus: {
        locked: true,
        email: userEmail,
        timestamp: new Date().toISOString(),
      },
    };
    setSelectedBannerDesignName(design.name);
    setBannerDesigns([...bannerDesigns, design]);
  };

  const onDesignChange = (updatedDesign: BannerDesign): void => {
    const updatedDesigns = bannerDesigns.map((design) =>
      design.name === updatedDesign.name ? updatedDesign : design,
    );

    setBannerDesigns(updatedDesigns);
  };

  const refreshDesign = (designName: string): Promise<void> =>
    fetchBannerDesign(designName).then((design: BannerDesign) => onDesignChange(design));

  const onLock = (designName: string, force: boolean): void => {
    void lockBannerDesign(designName, force)
      .then(() => refreshDesign(designName))
      .catch((error) => {
        alert(`Error while locking test: ${error}`);
        void refreshDesign(designName);
      });
  };

  const onUnlock = (designName: string): void => {
    const design = bannerDesigns.find((design) => design.name === designName);
    if (design?.isNew) {
      // if it's a new design then just drop from the in-memory list
      setBannerDesigns(bannerDesigns.filter((design) => design.name !== designName));
    } else {
      unlockBannerDesign(designName)
        .then(() => refreshDesign(designName))
        .catch((error) => {
          alert(`Error while unlocking test: ${error}`);
        });
    }
  };

  const onSave = (designName: string): void => {
    const design = bannerDesigns.find((design) => design.name === designName);

    if (design) {
      if (design.isNew) {
        const unlocked = {
          ...design,
          lockStatus: undefined,
        };
        createBannerDesign(unlocked)
          .then(() => refreshDesign(designName))
          .catch((error) => {
            alert(`Error while creating new design: ${error}`);
          });
      } else {
        updateBannerDesign(design)
          .then(() => refreshDesign(designName))
          .catch((error) => {
            alert(`Error while saving design: ${error}`);
          });
      }
    }
  };

  const onArchive = (designName: string): void => {
    archiveBannerDesign(designName)
      .then(() => refreshDesigns())
      .catch((error) => {
        alert(`Error while archiving design: ${error}`);
      });
  };

  const onStatusChange = (bannerDesignName: string | undefined, status: Status): void => {
    if (bannerDesignName) {
      updateBannerDesignStatus(bannerDesignName, status)
        .then(() => refreshDesign(bannerDesignName))
        .catch((error) => {
          alert(`Error while setting banner design status to ${status}: ${error}`);
        });
    }
  };

  const selectedBannerDesign = bannerDesigns.find((b) => b.name === selectedBannerDesignName);

  return (
    <Body>
      <LeftCol>
        <BannerDesignsSidebar
          designs={bannerDesigns}
          selectedDesign={selectedBannerDesign}
          onDesignSelected={(name) => setSelectedBannerDesignName(name)}
          createDesign={createDesign}
        />
      </LeftCol>
      <RightCol>
        {selectedBannerDesign ? (
          <BannerDesignEditor
            name={selectedBannerDesign.name}
            design={selectedBannerDesign}
            onLock={onLock}
            onUnlock={onUnlock}
            onSave={onSave}
            onArchive={onArchive}
            userHasLock={selectedBannerDesign.lockStatus?.email === userEmail}
            lockStatus={selectedBannerDesign.lockStatus ?? { locked: false }}
            onChange={onDesignChange}
            onStatusChange={(status) => onStatusChange(selectedBannerDesignName, status)}
          />
        ) : (
          <ViewTextContainer>
            <ViewText>Select an existing banner design from the menu,</ViewText>
            <ViewText>or create a new one</ViewText>
          </ViewTextContainer>
        )}
      </RightCol>
    </Body>
  );
};

export default BannerDesigns;
