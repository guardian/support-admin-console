import React from 'react';
import { Typography } from '@material-ui/core';
import {
  BannerDesign,
  BannerDesignImage,
  BasicColours,
  CtaDesign,
  GuardianRoundel,
  HighlightedTextColours,
} from '../../../models/bannerDesign';
import { useStyles } from '../helpers/testEditorStyles';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { ImageEditor } from './ImageEditor';
import { BasicColoursEditor } from './BasicColoursEditor';
import { HighlightedTextColoursEditor } from './HighlightedTextColoursEditor';
import { CtaColoursEditor } from './CtaColoursEditor';
import TypedRadioGroup from '../TypedRadioGroup';
import { BannerDesignUsage } from './BannerDesignUsage';

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

  const onHighlightedTextColoursChange = (highlightedTextColours: HighlightedTextColours): void => {
    onChange({
      ...design,
      colours: {
        ...design.colours,
        highlightedText: highlightedTextColours,
      },
    });
  };

  const onCtaColoursChange = (name: 'primaryCta' | 'secondaryCta' | 'closeButton') => (
    cta: CtaDesign,
  ): void => {
    onChange({
      ...design,
      colours: {
        ...design.colours,
        [name]: cta,
      },
    });
  };

  const onRoundelChange = (roundel: GuardianRoundel): void => {
    onChange({
      ...design,
      colours: {
        ...design.colours,
        guardianRoundel: roundel,
      },
    });
  };

  return (
    <div className={classes.container}>
      <div className={classes.sectionContainer}>
        <Typography variant={'h3'} className={classes.sectionHeader}>
          Usage
        </Typography>
        <BannerDesignUsage designName={design.name} />
      </div>
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
      <div className={[classes.sectionContainer, localClasses.colourSectionContainer].join(' ')}>
        <Typography variant={'h3'} className={classes.sectionHeader}>
          Highlighted Text Colours
        </Typography>
        <HighlightedTextColoursEditor
          colours={design.colours.highlightedText}
          isDisabled={isDisabled}
          onChange={onHighlightedTextColoursChange}
          onValidationChange={onValidationChange}
        />
      </div>
      <div className={[classes.sectionContainer, localClasses.colourSectionContainer].join(' ')}>
        <Typography variant={'h3'} className={classes.sectionHeader}>
          CTA Colours
        </Typography>

        <CtaColoursEditor
          cta={design.colours.primaryCta}
          isDisabled={isDisabled}
          onChange={onCtaColoursChange('primaryCta')}
          onValidationChange={onValidationChange}
          name={'colours.primaryCta'}
          label="Primary CTA"
        />
        <CtaColoursEditor
          cta={design.colours.secondaryCta}
          isDisabled={isDisabled}
          onChange={onCtaColoursChange('secondaryCta')}
          onValidationChange={onValidationChange}
          name={'colours.secondaryCta'}
          label="Secondary CTA"
        />
        <CtaColoursEditor
          cta={design.colours.closeButton}
          isDisabled={isDisabled}
          onChange={onCtaColoursChange('closeButton')}
          onValidationChange={onValidationChange}
          name={'colours.closeButton'}
          label="Close button"
        />
      </div>
      <div className={[classes.sectionContainer, localClasses.colourSectionContainer].join(' ')}>
        <Typography variant={'h3'} className={classes.sectionHeader}>
          Roundel style
        </Typography>
        <TypedRadioGroup
          selectedValue={design.colours.guardianRoundel}
          onChange={onRoundelChange}
          isDisabled={isDisabled}
          labels={{
            default: 'Default',
            brand: 'Brand',
            inverse: 'Inverse',
          }}
        />
      </div>
    </div>
  );
};

export default BannerDesignForm;
