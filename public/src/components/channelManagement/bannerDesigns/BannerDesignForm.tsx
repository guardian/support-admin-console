import React from 'react';
import { Typography } from '@material-ui/core';
import { BannerDesign, BannerDesignImage, BasicColours } from '../../../models/bannerDesign';
import { useStyles } from '../helpers/testEditorStyles';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { ImageEditor } from './ImageEditor';
import { BasicColoursEditor } from './BasicColoursEditor';

type Props = {
  design: BannerDesign;
  setValidationStatus: (scope: string, isValid: boolean) => void;
  isDisabled: boolean;
  onChange: (design: BannerDesign) => void;
};

export const useLocalStyles = makeStyles(({}: Theme) => ({
  colourSectionContainer: {
    '& input': {
      textTransform: 'uppercase',
    },
  },
}));

const BannerDesignForm: React.FC<Props> = ({
  design,
  setValidationStatus,
  isDisabled,
  onChange,
}: Props) => {
  const classes = useStyles();
  const localClasses = useLocalStyles();

  const onValidationChange = (fieldName: string, isValid: boolean): void => {
    setValidationStatus(fieldName, isValid);
  };

  const onImageChange = (image: BannerDesignImage): void => {
    onChange({
      ...design,
      image,
    });
  };

  const onBasicColoursChange = (basicColours: BasicColours): void => {
    onChange({
      ...design,
      colours: {
        ...design.colours,
        basic: basicColours,
      },
    });
  };

  return (
    <div className={classes.container}>
      <div className={classes.sectionContainer}>
        <Typography variant={'h3'} className={classes.sectionHeader}>
          Images
        </Typography>
        <ImageEditor
          image={design.image}
          isDisabled={isDisabled}
          onValidationChange={isValid => onValidationChange('imageUrls', isValid)}
          onChange={onImageChange}
        />
      </div>
      <div className={[classes.sectionContainer, localClasses.colourSectionContainer].join(' ')}>
        <Typography variant={'h3'} className={classes.sectionHeader}>
          Basic Colours
        </Typography>
        <BasicColoursEditor
          basicColours={design.colours.basic}
          isDisabled={isDisabled}
          onChange={onBasicColoursChange}
          onValidationChange={onValidationChange}
        />
      </div>
    </div>
  );
};

export default BannerDesignForm;
