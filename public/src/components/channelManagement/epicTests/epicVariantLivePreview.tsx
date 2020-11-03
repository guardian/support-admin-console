import React, {useEffect, useState} from "react";
import { Theme, makeStyles } from '@material-ui/core';
import * as emotion from 'emotion';
import * as emotionCore from '@emotion/core';
import * as emotionTheming from 'emotion-theming';
import {EpicVariant} from "./epicTestsForm";
import IconButton from '@material-ui/core/IconButton';
import Drawer from '@material-ui/core/Drawer';
import ChevronLeft from '@material-ui/icons/ChevronLeft';

const useStyles = makeStyles(({ palette, spacing }: Theme) => ({
  container: {
    position: "fixed",
    top: "50vh",
    right: "10px",
    // width: "620px"
  },
  menuButton: {

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

const anchor = 'right';

const EpicVariantLivePreview: React.FC<EpicVariantLivePreviewProps> = ({
  variant
}: EpicVariantLivePreviewProps) => {
  const classes = useStyles();

  const [Epic, setEpic] = useState<React.FC>();
  const [drawerOpen, setDrawerOpen] = useState<boolean>();

  useEffect(() => {
    window.guardian.automat = {
      react: React,
      preact: React,
      emotionCore,
      emotionTheming,
      emotion,
    };

    window.guardianImport('https://contributions.guardianapis.com/epic.js').then(epicModule => {
      console.log("module", module)
      setEpic(() => epicModule.ContributionsEpic);
    })
  }, []);

  const toggleDrawer = (anchor: string, open: boolean) => (
    event: React.KeyboardEvent | React.MouseEvent,
  ): void => {
    if (
      event.type === 'keydown' &&
      ((event as React.KeyboardEvent).key === 'Tab' ||
        (event as React.KeyboardEvent).key === 'Shift')
    ) {
      return;
    }

    setDrawerOpen(open);
  };


  const props = {
    onReminderOpen: () => {},
    variant: {
      "name": "CONTROL",
      heading: variant.heading,
      paragraphs: variant.paragraphs,
      highlightedText: variant.highlightedText,
      showTicker: false,
      cta: variant.cta
    },
    tracking: {
      "ophanPageId": "kh2cygvnxtiv6okonx9b",
      "platformId": "GUARDIAN_WEB",
      "clientName": "frontend",
      "referrerUrl": "https://www.theguardian.com/us-news/2020/nov/03/trump-era-division-america",
      "abTestName": "2020-11-02_US_ELECTION_RUNUP_ROUND2__UKAUS_WITH_ARTICLE_COUNT",
      "abTestVariant": "CONTROL",
      "campaignCode": "gdnwb_copts_memco_2020-11-02_US_ELECTION_RUNUP_ROUND2__UKAUS_WITH_ARTICLE_COUNT_CONTROL",
      "campaignId": "epic_2020-11-02_US_ELECTION_RUNUP_ROUND2__UKAUS_WITH_ARTICLE_COUNT",
      "componentType": "ACQUISITIONS_EPIC",
      "products": [
        "CONTRIBUTION",
        "MEMBERSHIP_SUPPORTER"
      ]
    },
    "numArticles": 13,
    "countryCode": "GB"
  };

  return (
    <div className={classes.container}>
      {
        Epic && (
          <React.Fragment key={anchor}>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={toggleDrawer(anchor, true)}
              edge="start"
              className={classes.menuButton}
            >
              <ChevronLeft className={classes.icon}/>
            </IconButton>
            <Drawer anchor={anchor} open={drawerOpen} onClose={toggleDrawer(anchor, false)}>
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
