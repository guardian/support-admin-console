import React, {useEffect, useState} from "react";
import { Theme, makeStyles } from '@material-ui/core';
import * as emotion from 'emotion';
import * as emotionCore from '@emotion/core';
import * as emotionTheming from 'emotion-theming';
import {EpicVariant} from "./epicTestsForm";
import IconButton from '@material-ui/core/IconButton';
import Drawer from '@material-ui/core/Drawer';
import ChevronLeft from '@material-ui/icons/ChevronLeft';


interface EpicProps {
  variant: EpicVariant;
  tracking: {
    ophanPageId: string;
    platformId: string;
    referrerUrl: string;
    clientName: string;
    abTestName: string;
    abTestVariant: string;
    campaignCode: string;
    campaignId: string;
    componentType: string;
    products: string[];
  };
  countryCode?: string;
  numArticles: number;
}

const anchor = 'right';

const buildProps = (variant: EpicVariant): EpicProps => ({
  variant: {
    name: variant.name,
    heading: variant.heading,
    paragraphs: variant.paragraphs,
    highlightedText: variant.highlightedText,
    showTicker: false,
    cta: variant.cta
  },
  tracking: {
    ophanPageId: "ophanPageId",
    platformId: "GUARDIAN_WEB",
    clientName: "frontend",
    referrerUrl: "https://www.theguardian.com/",
    abTestName: "abTestName",
    abTestVariant: variant.name,
    campaignCode: "campaignCode",
    campaignId: "",
    componentType: "ACQUISITIONS_EPIC",
    products: []
  },
  numArticles: 13,
  countryCode: "GB"
});

const useStyles = makeStyles(({ palette, spacing }: Theme) => ({
  container: {
    position: "fixed",
    top: "50vh",
    right: "10px",
  },
  epic: {
    width: "620px"
  },
  icon: {
    width: '40px',
    height: '40px',
    background: palette.grey[900],
    borderRadius: '50%',
    color: 'white',
    cursor: 'pointer',
  }
}));

interface EpicVariantLivePreviewProps {
  variant: EpicVariant;
}

const EpicVariantLivePreview: React.FC<EpicVariantLivePreviewProps> = ({
  variant
}: EpicVariantLivePreviewProps) => {
  const classes = useStyles();

  const [Epic, setEpic] = useState<React.FC<EpicProps>>();
  const [drawerOpen, setDrawerOpen] = useState<boolean>();

  useEffect(() => {
    // @ts-ignore
    window.guardian.automat = {
      react: React,
      preact: React,
      emotionCore,
      emotionTheming,
      emotion,
    };

    // @ts-ignore
    window.remoteImport('https://contributions.guardianapis.com/epic.js').then(epicModule => {
      setEpic(() => epicModule.ContributionsEpic);
    })
  }, []);

  const toggleDrawer = (open: boolean) => (
    event: React.KeyboardEvent | React.MouseEvent,
  ): void => {
    setDrawerOpen(open);
  };


  const props = buildProps(variant);

  return (
    <div className={classes.container}>
      {
        Epic && (
          <React.Fragment key={anchor}>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={toggleDrawer(true)}
              edge="start"
            >
              <ChevronLeft className={classes.icon}/>
            </IconButton>
            <Drawer anchor={anchor} open={drawerOpen} onClose={toggleDrawer(false)}>
              <div className={classes.epic}>
                <Epic {...props}/>
              </div>
            </Drawer>
          </React.Fragment>
        )
      }
    </div>
  )
};

export default EpicVariantLivePreview;
