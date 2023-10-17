import React, { useState } from 'react';
import BannerVariantPreview from '../bannerTests/bannerVariantPreview';
import { BannerDesign } from '../../../models/bannerDesign';
import { Checkbox, FormControlLabel } from '@material-ui/core';
import { BannerVariant } from '../../../models/banner';
import { TickerCountType, TickerEndType, TickerName } from '../helpers/shared';
import { DEV_AND_CODE_DEFAULT_VARIANT } from '../bannerTests/utils/defaults';

interface Props {
  design: BannerDesign;
}

interface TickerToggleProps {
  shouldShowTicker: boolean;
  setShouldShowTicker: (shouldShowTicker: boolean) => void;
}

const TickerToggle = ({ shouldShowTicker, setShouldShowTicker }: TickerToggleProps) => {
  return (
    <FormControlLabel
      control={
        <Checkbox
          checked={shouldShowTicker}
          onChange={() => setShouldShowTicker(!shouldShowTicker)}
          color="primary"
        />
      }
      label={'Show ticker?'}
    />
  );
};

const buildVariantForPreview = (design: BannerDesign, shouldShowTicker: boolean): BannerVariant => {
  const tickerSettings = shouldShowTicker
    ? {
        countType: TickerCountType.money,
        endType: TickerEndType.hardstop,
        currencySymbol: '£',
        copy: {
          countLabel: 'contributions in May',
          goalReachedPrimary: "We've met our goal - thank you!",
          goalReachedSecondary: '',
        },
        name: TickerName.US,
      }
    : undefined;

  return {
    ...DEV_AND_CODE_DEFAULT_VARIANT, // always use CODE config for design previews
    template: { designName: design.name },
    tickerSettings,
  };
};

const BannerDesignPreview: React.FC<Props> = ({ design }: Props) => {
  const [shouldShowTicker, setShouldShowTicker] = useState<boolean>(false);

  return (
    <BannerVariantPreview
      variant={buildVariantForPreview(design, shouldShowTicker)}
      design={design}
      controls={
        <TickerToggle
          shouldShowTicker={shouldShowTicker}
          setShouldShowTicker={setShouldShowTicker}
        />
      }
    />
  );
};

export { BannerDesignPreview };
