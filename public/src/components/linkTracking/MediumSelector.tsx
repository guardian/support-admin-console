import { FormControl, MenuItem, Select, Theme } from '@mui/material';
import React from 'react';
import { Control, Controller } from 'react-hook-form';
import { makeStyles } from '@mui/styles';

interface Option {
  value: string;
  label: string;
}
interface OptionGroup {
  group: string;
  options: Option[];
}

const OPTIONS: OptionGroup[] = [
  {
    group: 'AFFILIATES',
    options: [{ value: 'awin', label: 'Affiliates Window (awin)' }],
  },
  {
    group: 'APPLE_NEWS',
    options: [
      { value: 'ACQUISITIONS_ARTICLE_EMBED', label: 'ACQUISITIONS_ARTICLE_EMBED' },
      { value: 'ACQUISITIONS_EPIC', label: 'ACQUISITIONS_EPIC' },
      { value: 'ACQUISITIONS_HOUSE_ADS', label: 'ACQUISITIONS_HOUSE_ADS' },
      { value: 'DISPLAY_AD', label: 'DISPLAY_AD' },
    ],
  },
  {
    group: 'AUDIO',
    options: [
      { value: 'acastrec', label: 'Acast recommends (acastrec)' },
      { value: 'dyn', label: 'Dynamic (dyn)' },
      { value: 'hstrd', label: 'Host reads (hstrd)' },
      { value: 'description', label: 'Podcast description (description)' },
      { value: 'spot', label: 'Spotify (spot)' },
    ],
  },
  {
    group: 'DISPLAY',
    options: [
      { value: 'dispad', label: 'Display ad (dispad)' },
      { value: 'pgmtc', label: 'Programmatic (pgmtc)' },
    ],
  },
  {
    group: 'EMAIL',
    options: [
      { value: 'email_editorial', label: 'Editorial (email_editorial)' },
      { value: 'email_marketing', label: 'Marketing (email_marketing)' },
      { value: 'email_service', label: 'Service (email_service)' },
      { value: 'email_other', label: 'Other (email_other)' },
    ],
  },
  {
    group: 'GUARDIAN_APP',
    options: [{ value: 'push', label: 'Push notification (push)' }],
  },
  {
    group: 'GUARDIAN_WEB',
    options: [
      { value: 'ACQUISITIONS_BUTTON', label: 'ACQUISITIONS_BUTTON' },
      { value: 'ACQUISITIONS_EDITORIAL_LINK', label: 'ACQUISITIONS_EDITORIAL_LINK' },
      { value: 'ACQUISITIONS_ENGAGEMENT_BANNER', label: 'ACQUISITIONS_ENGAGEMENT_BANNER' },
      { value: 'ACQUISITIONS_EPIC', label: 'ACQUISITIONS_EPIC' },
      { value: 'ACQUISITIONS_FOOTER', label: 'ACQUISITIONS_FOOTER' },
      { value: 'ACQUISITIONS_HEADER', label: 'ACQUISITIONS_HEADER' },
      { value: 'ACQUISITIONS_HOUSE_ADS', label: 'ACQUISITIONS_HOUSE_ADS' },
      { value: 'ACQUISITIONS_INTERACTIVE_SLICE', label: 'ACQUISITIONS_INTERACTIVE_SLICE' },
      { value: 'ACQUISITIONS_MANAGE_MY_ACCOUNT', label: 'ACQUISITIONS_MANAGE_MY_ACCOUNT' },
      { value: 'ACQUISITIONS_MERCHANDISING', label: 'ACQUISITIONS_MERCHANDISING' },
      { value: 'ACQUISITIONS_NUGGET', label: 'ACQUISITIONS_NUGGET' },
      { value: 'ACQUISITIONS_OTHER', label: 'ACQUISITIONS_OTHER' },
      { value: 'ACQUISITIONS_STANDFIRST', label: 'ACQUISITIONS_STANDFIRST' },
      { value: 'ACQUISITIONS_SUBSCRIPTIONS_BANNER', label: 'ACQUISITIONS_SUBSCRIPTIONS_BANNER' },
      { value: 'ACQUISITIONS_SUPPORT_SITE', label: 'ACQUISITIONS_SUPPORT_SITE' },
      { value: 'ACQUISITIONS_THANK_YOU_EPIC', label: 'ACQUISITIONS_THANK_YOU_EPIC' },
      { value: 'ACQUISITIONS_THRASHER', label: 'ACQUISITIONS_THRASHER' },
      { value: 'AUDIO_ATOM', label: 'AUDIO_ATOM' },
      { value: 'CHART_ATOM', label: 'CHART_ATOM' },
      { value: 'GUIDE_ATOM', label: 'GUIDE_ATOM' },
      { value: 'HELP_CENTER', label: 'Help Center' },
      { value: 'IDENTITY_AUTHENTICATION', label: 'IDENTITY_AUTHENTICATION' },
      { value: 'MOBILE_STICKY_AD', label: 'MOBILE_STICKY_AD' },
      { value: 'NEWSLETTER_SUBSCRIPTION', label: 'NEWSLETTER_SUBSCRIPTION' },
      { value: 'PROFILE_ATOM', label: 'PROFILE_ATOM' },
      { value: 'QANDA_ATOM', label: 'QANDA_ATOM' },
      { value: 'READERS_QUESTIONS_ATOM', label: 'READERS_QUESTIONS_ATOM' },
      { value: 'RETENTION_BANNER', label: 'RETENTION_BANNER' },
      { value: 'RETENTION_ENGAGEMENT_BANNER', label: 'RETENTION_ENGAGEMENT_BANNER' },
      { value: 'RETENTION_EPIC', label: 'RETENTION_EPIC' },
      { value: 'SIGN_IN_GATE', label: 'SIGN_IN_GATE' },
      { value: 'SURVEYS_QUESTIONS', label: 'SURVEYS_QUESTIONS' },
      { value: 'TIMELINE_ATOM', label: 'TIMELINE_ATOM' },
      { value: 'housead', label: 'Housead' },
      { value: 'merchhgh', label: 'Merchandising high (merchhgh)' },
      { value: 'merchin', label: 'Merchandising inline (merchin)' },
      { value: 'merchlow', label: 'Merchandising low (merchlow)' },
      { value: 'navbar', label: 'Navbar' },
    ],
  },
  {
    group: 'ORGANIC_SOCIAL',
    options: [
      { value: 'sfbk', label: 'Social Facebook (sfbk)' },
      { value: 'sisgm', label: 'Social Instagram (sisgm)' },
      { value: 'slkn', label: 'Social Linkedin (slkn)' },
      { value: 'spint', label: 'Social Pinterest (spint)' },
      { value: 'quora', label: 'Social Quora (quora)' },
      { value: 'reddit', label: 'Social Reddit (reddit)' },
      { value: 'stik', label: 'Social TikTok (stik)' },
      { value: 'stwr', label: 'Social Twitter (stwr)' },
      { value: 'sytb', label: 'Social YouTube (sytb)' },
      { value: 'sbsky', label: 'Social Bluesky (sbsky)' },
      { value: 'sother', label: 'Other (osother)' },
    ],
  },
  {
    group: 'OUTDOOR',
    options: [
      { value: 'dooh', label: 'Digital OOH (dooh)' },
      { value: 'pos', label: 'Point of Sale (pos)' },
      { value: 'tcp', label: 'Tube Card Panels (tcp)' },
      { value: 'tvis', label: 'Transvision (tvis)' },
    ],
  },
  {
    group: 'PAID_SOCIAL',
    options: [
      { value: 'sfbk', label: 'Social Facebook (sfbk)' },
      { value: 'sisgm', label: 'Social Instagram (sisgm)' },
      { value: 'slkn', label: 'Social Linkedin (slkn)' },
      { value: 'spint', label: 'Social Pinterest (spint)' },
      { value: 'quora', label: 'Social Quora (quora)' },
      { value: 'reddit', label: 'Social Reddit (reddit)' },
      { value: 'stik', label: 'Social TikTok (stik)' },
      { value: 'stwr', label: 'Social Twitter (stwr)' },
      { value: 'sytb', label: 'Social YouTube (sytb)' },
      { value: 'sbsky', label: 'Social Bluesky (sbsky)' },
      { value: 'sother', label: 'Other (osother)' },
    ],
  },
  {
    group: 'PPC',
    options: [
      { value: 'pdsbg', label: 'Paid search Bing (pdsbg)' },
      { value: 'pdsge', label: 'Paid search Google (pdsge)' },
      { value: 'pmax', label: 'Performance Max (pmax)' },
    ],
  },
  {
    group: 'PRINT',
    options: [
      { value: 'dirm', label: 'Direct Mail (dirm)' },
      { value: 'inpaper-g', label: 'Inpaper (inpaper-g)' },
      { value: 'insr', label: 'Inserts (insr)' },
      { value: 'prsctrlm', label: 'Press Control Message (prsctrlm)' },
      { value: 'prssupm', label: 'Press Supporting Message (prssupm)' },
      { value: 'smpbr', label: 'Sampling Brochure (smpbr)' },
    ],
  },
  {
    group: 'RETAIL',
    options: [{ value: 'urtr', label: 'Unknown retail (urtr)' }],
  },
  {
    group: 'TELEMARKETING',
    options: [{ value: 'ctcter', label: 'Contact Center (ctcter)' }],
  },
  {
    group: 'UNKNOWN',
    options: [{ value: 'other', label: 'other (other)' }],
  },
  {
    group: 'VIDEO',
    options: [
      { value: 'a4', label: 'All4 (a4)' },
      { value: 'itvh', label: 'ITVHub (itvh)' },
      { value: 'preroll', label: 'Preroll (preroll)' },
      { value: 'sky', label: 'Sky (sky)' },
    ],
  },
];

const useStyles = makeStyles(({ spacing }: Theme) => ({
  groupHeading: {
    fontWeight: 700,
  },
  item: {
    marginLeft: spacing(2),
  },
}));

interface Props {
  control: Control;
  onUpdate: () => void;
}

/**
 * A selector for choosing a medium. The value is the source and medium separated by a double underscore.
 * This is because the link tracking should contain both, but the source should not be chosen directly by the user.
 */
export const MediumSelector: React.FC<Props> = ({ control, onUpdate }: Props) => {
  const classes = useStyles();

  return (
    <FormControl>
      <Controller
        name="sourceAndMedium"
        rules={{ required: true }}
        render={({ onChange, value }) => (
          <Select
            value={value}
            onChange={e => {
              onUpdate();
              onChange(e);
            }}
            error={!!control.formState.errors?.medium}
          >
            {OPTIONS.map(group => {
              const groupItem = (
                <MenuItem
                  className={classes.groupHeading}
                  value={group.group}
                  key={group.group}
                  disabled
                >
                  {group.group}
                </MenuItem>
              );
              const items = group.options.map(medium => (
                <MenuItem
                  className={classes.item}
                  value={`${group.group}__${medium.value}`}
                  key={`${group.group}-${medium.value}`}
                >
                  {medium.label}
                </MenuItem>
              ));
              return [groupItem].concat(items);
            })}
          </Select>
        )}
        control={control}
        defaultValue={''}
      />
    </FormControl>
  );
};
