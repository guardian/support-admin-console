import React from 'react';
import { createStyles, withStyles, WithStyles } from '@material-ui/core';
import RadioGroup from '@material-ui/core/RadioGroup';
import Radio from '@material-ui/core/Radio';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { BannerTemplate, BannerVariant } from './bannerTestsForm';

function isBannerTemplate(s: string): s is BannerTemplate {
  return Object.values(BannerTemplate).includes(s as BannerTemplate);
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const styles = () =>
  createStyles({
    templates: {
      marginTop: '15px',
    },
  });

interface BannerTemplateSelectorProps extends WithStyles<typeof styles> {
  variant: BannerVariant;
  onVariantChange: (updatedVariant: BannerVariant) => void;
  editMode: boolean;
}

const templatesWithLabels = [
  { template: BannerTemplate.ContributionsBanner, label: 'Contributions' },
  { template: BannerTemplate.DigitalSubscriptionsBanner, label: 'Digital subscriptions' },
  { template: BannerTemplate.GuardianWeeklyBanner, label: 'Guardian Weekly' },
];

const BannerTemplateSelector: React.FC<BannerTemplateSelectorProps> = ({
  classes,
  variant,
  onVariantChange,
  editMode,
}: BannerTemplateSelectorProps) => (
  <RadioGroup
    aria-label="Default"
    name="default"
    className={classes.templates}
    value={variant.template}
    onChange={(event, value): void => {
      if (isBannerTemplate(value)) {
        onVariantChange({
          ...variant,
          template: value,
        });
      }
    }}
  >
    {templatesWithLabels.map(withLabel => (
      <FormControlLabel
        key={withLabel.template}
        value={withLabel.template}
        control={<Radio disabled={!editMode} />}
        label={withLabel.label}
      />
    ))}
  </RadioGroup>
);

export default withStyles(styles)(BannerTemplateSelector);
