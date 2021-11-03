import React from 'react';
import {
  Theme,
  createStyles,
  withStyles,
  WithStyles,
  FormControl,
  Slider,
  Switch,
  Typography,
  InputLabel,
  Select,
  MenuItem
} from '@material-ui/core';
import { PropensityThresholds, Product, products } from '../../models/banner';
import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles(({ spacing }: Theme) =>
  ({
    container: {
      display: 'flex',
      alignItems: 'center',
      margin: "48px 0"
    },
    toggle: {
      width: "15%"
    }, 
    slider: {
      width: "65%",
      '& .MuiSlider-marked': {
        marginBottom: 0
      }
    },
    header: {
      width: "20%",
      fontSize: 14,
      fontWeight: 500,
      letterSpacing: 1,
      textTransform: 'uppercase',
    },
  }));

interface TestEditorPropensityThresholdsProps {
  propensityThresholds?: PropensityThresholds;
  updateThresholds: (propensityThresholds: PropensityThresholds) => void;
  isDisabled: boolean;
}

interface PropensityRowProps {
  product: Product;
  thresholds: PropensityThresholds;
  updateThresholds: (propensityThresholds: PropensityThresholds) => void;
  isDisabled: boolean;
}

const productNames = {
  guardianWeekly: "Guardian Weekly",
  digitalSubscription: "Digital Subscription",
  contributions: "Contributions"
};

const PropensityRow: React.FC<PropensityRowProps> = ({ isDisabled, thresholds, updateThresholds, product }) => {
    const classes = useStyles();

    const productProperties = thresholds[product] ?? { min: 0, max: 1 };

    const handleChange = (_: any, newValue: number | number[]) => {
      updateThresholds && updateThresholds({ ...thresholds,  [product]: { min: (newValue as number[])[0], max: (newValue as number[])[1]}})
    };

    const marks = [
      {
        value: 0,
        label: '0',
      },
      {
        value: 1,
        label: '1',
      },
    ];

    const isOn = !!thresholds[product];

    const handleSwitchChange = () => {
      if (isOn) {
        updateThresholds({...thresholds, [product]: undefined})
      } else {
        updateThresholds({...thresholds, [product]: { min: 0, max: 1}})
      }
    }


    return (
      <div className={classes.container}>
        <Typography variant="h4" className={classes.header}>
          {productNames[product]}
        </Typography>
        <div className={classes.toggle}>
          <Switch
            checked={isOn}
            onChange={handleSwitchChange}
            disabled={isDisabled}
          />
        </div>
        { isOn && (
            <div className={classes.slider}>
              <Slider
                min={0}
                max={1}
                marks={marks}
                getAriaLabel={() => 'Propensity score'}
                value={[productProperties.min, productProperties.max]}
                onChange={handleChange}
                valueLabelDisplay="on"
                step={0.05}
                disabled={isDisabled}
              />
            </div>
        )}
      </div>
    );
  };

const TestEditorPropensityThresholds: React.FC<TestEditorPropensityThresholdsProps> = ({ isDisabled, propensityThresholds, updateThresholds }) => {
  const thresholds = propensityThresholds ?? {};

  return (
    <>
      {products.map(product => (
        <PropensityRow isDisabled={isDisabled} thresholds={thresholds} updateThresholds={updateThresholds} product={product} />
      ))}
    </>
  )
};

export default TestEditorPropensityThresholds;
