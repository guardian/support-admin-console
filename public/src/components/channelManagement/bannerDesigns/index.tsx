import React, { useEffect, useState } from 'react';
import { makeStyles, Theme, Typography } from '@material-ui/core';
import BannerDesignsSidebar from './BannerDesignsSidebar';
import BannerDesignEditor from './BannerDesignEditor';
import { useParams } from 'react-router-dom';

import { fetchBannerDesigns } from '../../../utils/requests';
import { BannerDesign } from '../../../models/BannerDesign';

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
}));

const BannerDesigns: React.FC = () => {
  const [bannerDesigns, setBannerDesigns] = useState<BannerDesign[]>([]);
  const { bannerDesignName } = useParams<{ bannerDesignName?: string }>(); // querystring parameter
  const [selectedBannerDesignName, setSelectedBannerDesignName] = useState<string | undefined>();
  const classes = useStyles();

  useEffect(() => {
    fetchBannerDesigns().then(bannerDesigns => {
      setBannerDesigns(bannerDesigns);
    });
  }, []);

  useEffect(() => {
    if (bannerDesignName != null) {
      setSelectedBannerDesignName(bannerDesignName);
    }
  }, [bannerDesignName, bannerDesigns]);

  const selectedBannerDesign = bannerDesigns.find(b => b.name === selectedBannerDesignName);

  const createDesign = (design: BannerDesign): void => {
    console.log('Creating banner design!', design);
  };

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
          <BannerDesignEditor bannerDesign={selectedBannerDesign} />
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
