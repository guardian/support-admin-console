import React from 'react';
import { createStyles, withStyles, WithStyles } from '@material-ui/core';
import RadioGroup from '@material-ui/core/RadioGroup';
import Radio from '@material-ui/core/Radio';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { HeadTemplate, HeadVariant } from '../../../models/head';

function isHeadTemplate(s: string): s is HeadTemplate {
  return Object.values(HeadTemplate).includes(s as HeadTemplate);
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const styles = () =>
  createStyles({
    templates: {
      marginTop: '15px',
    },
  });

interface HeadTemplateSelectorProps extends WithStyles<typeof styles> {
  variant: HeadVariant;
  onVariantChange: (updatedVariant: HeadVariant) => void;
  editMode: boolean;
}

const templatesWithLabels = [
  { template: HeadTemplate.ContributionsHead, label: 'Contributions' },
  {
    template: HeadTemplate.ContributionsHeadWithSignIn,
    label: 'Contributions - with sign in link',
  },
  { template: HeadTemplate.DigitalSubscriptionsHead, label: 'Digital subscriptions' },
  { template: HeadTemplate.GuardianWeeklyHead, label: 'Guardian Weekly' },
  { template: HeadTemplate.InvestigationsMomentHead, label: 'Investigations moment' },
  { template: HeadTemplate.EnvironmentMomentHead, label: 'Environment moment' },
  { template: HeadTemplate.UsEoyMomentHead, label: 'US EOY moment' },
  {
    template: HeadTemplate.UsEoyMomentGivingTuesdayHead,
    label: 'US EOY Giving Tuesday moment',
  },
];

const HeadTemplateSelector: React.FC<HeadTemplateSelectorProps> = ({
  classes,
  variant,
  onVariantChange,
  editMode,
}: HeadTemplateSelectorProps) => (
  <RadioGroup
    aria-label="Default"
    name="default"
    className={classes.templates}
    value={variant.template}
    onChange={(event, value): void => {
      if (isHeadTemplate(value)) {
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

export default withStyles(styles)(HeadTemplateSelector);
