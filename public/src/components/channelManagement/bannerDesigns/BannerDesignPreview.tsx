import React, { useState } from 'react';
import BannerVariantPreview from '../bannerTests/bannerVariantPreview';
import { BannerDesign } from '../../../models/bannerDesign';
import { Checkbox, FormControlLabel } from '@mui/material';
import { BannerVariant } from '../../../models/banner';
import { SecondaryCtaType, TickerCountType, TickerEndType, TickerName } from '../helpers/shared';

interface Props {
  design: BannerDesign;
}

interface ToggleProps {
  shouldShow: boolean;
  setShouldShow: (shouldShow: boolean) => void;
}

const TickerToggle = ({
  shouldShow: shouldShowTicker,
  setShouldShow: setShouldShowTicker,
}: ToggleProps) => {
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

const ReminderToggle = ({
  shouldShow: shouldShowReminder,
  setShouldShow: setShouldShowReminder,
}: ToggleProps) => {
  return (
    <FormControlLabel
      control={
        <Checkbox
          checked={shouldShowReminder}
          onChange={() => setShouldShowReminder(!shouldShowReminder)}
          color="primary"
        />
      }
      label={'Show reminder?'}
    />
  );
};

const buildVariantForPreview = (
  design: BannerDesign,
  shouldShowTicker: boolean,
  shouldShowReminder: boolean,
): BannerVariant => ({
  name: 'CONTROL',
  template: { designName: design.name },
  bannerContent: {
    heading: 'We chose a different approach. Will you support it?',
    paragraphs: [
      'We believe every one of us deserves to read quality, independent, fact-checked news and measured explanation – that’s why we keep Guardian journalism open to all. Our editorial independence has never been so vital. No one sets our agenda, or edits our editor, so we can keep providing independent reporting each and every day. No matter how unpredictable the future feels, we will remain with you. Every contribution, however big or small, makes our work possible – in times of crisis and beyond.',
    ],
    highlightedText: 'Support the Guardian from as little as %%CURRENCY_SYMBOL%%1. Thank you.',
    cta: {
      text: 'Support the Guardian',
      baseUrl: 'https://support.theguardian.com/contribute',
    },
    secondaryCta: shouldShowReminder
      ? {
          type: SecondaryCtaType.Custom,
          cta: {
            text: 'Support monthly',
            baseUrl: 'https://support.theguardian.com/contribute/recurring',
          },
        }
      : undefined,
  },
  separateArticleCount: true,
  tickerSettings: shouldShowTicker
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
    : undefined,
});

const BannerDesignPreview: React.FC<Props> = ({ design }: Props) => {
  const [shouldShowTicker, setShouldShowTicker] = useState<boolean>(false);
  const [shouldShowReminder, setShouldShowReminder] = useState<boolean>(false);

  return (
    <BannerVariantPreview
      variant={buildVariantForPreview(design, shouldShowTicker, shouldShowReminder)}
      design={design}
      controls={
        <>
          <TickerToggle shouldShow={shouldShowTicker} setShouldShow={setShouldShowTicker} />
          <ReminderToggle shouldShow={shouldShowReminder} setShouldShow={setShouldShowReminder} />
        </>
      }
    />
  );
};

export { BannerDesignPreview };
