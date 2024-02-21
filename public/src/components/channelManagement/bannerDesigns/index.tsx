import React, { useEffect, useState } from 'react';
import { Theme, Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';
import BannerDesignsSidebar from './BannerDesignsSidebar';
import BannerDesignEditor from './BannerDesignEditor';
import { useParams } from 'react-router-dom';

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
import { BannerDesign } from '../../../models/bannerDesign';
import { createDefaultBannerDesign } from './utils/defaults';
import { Status } from '../../../models/bannerDesign';

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
  scrollableContainer: {
    overflowY: 'auto',
    paddingLeft: spacing(3),
    paddingRight: spacing(1),
    paddingTop: spacing(2),
  },
}));

const BannerDesigns: React.FC = () => {
  const [bannerDesigns, setBannerDesigns] = useState<BannerDesign[]>([]);
  const { bannerDesignName } = useParams<{ bannerDesignName?: string }>(); // querystring parameter
  const [selectedBannerDesignName, setSelectedBannerDesignName] = useState<string | undefined>();
  const [userEmail, setUserEmail] = useState<string>('');

  const classes = useStyles();

  const refreshDesigns = () => {
    fetchFrontendSettings(FrontendSettingsType.bannerDesigns).then(
      (response: BannerDesignsResponse) => {
        setBannerDesigns(response.bannerDesigns);
        setUserEmail(response.userEmail);
      },
    );
  };

  useEffect(() => {
    refreshDesigns();
  }, []);

  useEffect(() => {
    if (bannerDesignName != null) {
      setSelectedBannerDesignName(bannerDesignName);
    }
  }, [bannerDesignName, bannerDesigns]);

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
    const updatedDesigns = bannerDesigns.map(design =>
      design.name === updatedDesign.name ? updatedDesign : design,
    );

    setBannerDesigns(updatedDesigns);
  };

  const refreshDesign = (designName: string): Promise<void> =>
    fetchBannerDesign(designName).then((design: BannerDesign) => onDesignChange(design));

  const onLock = (designName: string, force: boolean): void => {
    lockBannerDesign(designName, force)
      .then(() => refreshDesign(designName))
      .catch(error => {
        alert(`Error while locking test: ${error}`);
        refreshDesign(designName);
      });
  };

  const onUnlock = (designName: string): void => {
    const design = bannerDesigns.find(design => design.name === designName);
    if (design && design.isNew) {
      // if it's a new design then just drop from the in-memory list
      setBannerDesigns(bannerDesigns.filter(design => design.name !== designName));
    } else {
      unlockBannerDesign(designName)
        .then(() => refreshDesign(designName))
        .catch(error => {
          alert(`Error while unlocking test: ${error}`);
        });
    }
  };

  const onSave = (designName: string): void => {
    const design = bannerDesigns.find(design => design.name === designName);

    if (design) {
      if (design.isNew) {
        const unlocked = {
          ...design,
          lockStatus: undefined,
        };
        createBannerDesign(unlocked)
          .then(() => refreshDesign(designName))
          .catch(error => {
            alert(`Error while creating new design: ${error}`);
          });
      } else {
        updateBannerDesign(design)
          .then(() => refreshDesign(designName))
          .catch(error => {
            alert(`Error while saving design: ${error}`);
          });
      }
    }
  };

  const onArchive = (designName: string): void => {
    archiveBannerDesign(designName)
      .then(() => refreshDesigns())
      .catch(error => {
        alert(`Error while archiving design: ${error}`);
      });
  };

  const onStatusChange = (bannerDesignName: string | undefined, status: Status): void => {
    if (bannerDesignName) {
      updateBannerDesignStatus(bannerDesignName, status)
        .then(() => refreshDesign(bannerDesignName))
        .catch(error => {
          alert(`Error while setting banner design status to ${status}: ${error}`);
        });
    }
  };

  const selectedBannerDesign = bannerDesigns.find(b => b.name === selectedBannerDesignName);

  return (
    <div className={classes.body}>
      <div className={classes.leftCol}>
        <BannerDesignsSidebar
          designs={bannerDesigns}
          selectedDesign={selectedBannerDesign}
          onDesignSelected={name => setSelectedBannerDesignName(name)}
          createDesign={createDesign}
        />
      </div>
      <div className={classes.rightCol}>
        {selectedBannerDesign ? (
          <BannerDesignEditor
            name={selectedBannerDesign.name}
            design={selectedBannerDesign}
            onLock={onLock}
            onUnlock={onUnlock}
            onSave={onSave}
            onArchive={onArchive}
            userHasLock={selectedBannerDesign.lockStatus?.email === userEmail}
            lockStatus={selectedBannerDesign.lockStatus || { locked: false }}
            onChange={onDesignChange}
            onStatusChange={status => onStatusChange(selectedBannerDesignName, status)}
          />
        ) : (
          <div className={classes.viewTextContainer}>
            <Typography className={classes.viewText}>
              Select an existing banner design from the menu,
            </Typography>
            <Typography className={classes.viewText}>or create a new one</Typography>
          </div>
        )}
      </div>
    </div>
  );
};

export default BannerDesigns;
