import React from 'react';
import makeStyles from "@material-ui/core/styles/makeStyles";

const styles = makeStyles({
  body: {
    textAlign: 'center',
    minWidth: '100vw',
    height: 'calc(100vh - 64px)',
    top: '64px',
    padding: 'auto',
    margin: '-80px',
    overflow: 'hidden',
    position: 'relative',
  },

  content: {
    position: 'relative',
    top: '30%',
    width: '100%',
    color: '#212121',
    fontSize: '16pt',
    lineHeight: '24px',
    textAlign: 'center',
  }
});

export default function BannerToolPlaceHolder() {
  const classes = styles();
  return (
    <div className={classes.body}>
      <p className={classes.content}>
        🚧 Apologies, our Banner Tool is still under construction. 🚧
      </p>
      <p className={classes.content}>
        Please select another tool from the menu.
      </p>
    </div>
  )
}
