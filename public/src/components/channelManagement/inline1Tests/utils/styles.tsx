export type Inline1SupportMessageStyle = {
  id: string;
  label: string;
  themes: Inline1SupportMessageTheme[];
};

export type Inline1SupportMessageTheme = {
  id: string;
  label: string;
  colours: Inline1SupportMessageColours;
};

export type Inline1SupportMessageColours = {
  backgroundColor: string;
  headlineColor: string;
  guardianLogoColor: string;
  fontColor: string;
  ctaBackgroundColor: string;
  ctaFontColor: string;
};

export const inline1SupportMessageStyles: Inline1SupportMessageStyle[] = [
  {
    id: 'Business as usual',
    label: 'Business as usual',
    themes: [
      {
        id: 'support-default',
        label: 'Support, Default',
        colours: {
          backgroundColor: '#F1F8FC',
          headlineColor: '#052962',
          guardianLogoColor: '#000000',
          fontColor: '#000000',
          ctaBackgroundColor: '#FFE500',
          ctaFontColor: '#052962',
        },
      },
      {
        id: 'support-default-image',
        label: 'Support, Default (Image)',
        colours: {
          backgroundColor: '#F1F8FC',
          headlineColor: '#052962',
          guardianLogoColor: '#000000',
          fontColor: '#000000',
          ctaBackgroundColor: '#FFE500',
          ctaFontColor: '#052962',
        },
      },
      {
        id: 'support-bold',
        label: 'Support, Bold',
        colours: {
          backgroundColor: '#FFE500',
          headlineColor: '#000000',
          guardianLogoColor: '#000000',
          fontColor: '#000000',
          ctaBackgroundColor: '#052962',
          ctaFontColor: '#FFFFFF',
        },
      },
      {
        id: 'support-bold-image',
        label: 'Support, Bold (Image)',
        colours: {
          backgroundColor: '#FFE500',
          headlineColor: '#000000',
          guardianLogoColor: '#000000',
          fontColor: '#000000',
          ctaBackgroundColor: '#052962',
          ctaFontColor: '#FFFFFF',
        },
      },
      {
        id: 'hope-default',
        label: 'Hope, Default',
        colours: {
          backgroundColor: '#F6F6F6',
          headlineColor: '#0077B6',
          guardianLogoColor: '#000000',
          fontColor: '#000000',
          ctaBackgroundColor: '#90DCFF',
          ctaFontColor: '#000000',
        },
      },
      {
        id: 'hope-default-image',
        label: 'Hope, Default (Image)',
        colours: {
          backgroundColor: '#0077B6',
          headlineColor: '#FFFFFF',
          guardianLogoColor: '#FFFFFF',
          fontColor: '#FFFFFF',
          ctaBackgroundColor: '#90DCFF',
          ctaFontColor: '#000000',
        },
      },
      {
        id: 'hope-gentle',
        label: 'Hope, Gentle',
        colours: {
          backgroundColor: '#90DCFF',
          headlineColor: '#000000',
          guardianLogoColor: '#000000',
          fontColor: '#000000',
          ctaBackgroundColor: '#0077B6',
          ctaFontColor: '#FFFFFF',
        },
      },
      {
        id: 'hope-gentle-image',
        label: 'Hope, Gentle (Image)',
        colours: {
          backgroundColor: '#90DCFF',
          headlineColor: '#000000',
          guardianLogoColor: '#000000',
          fontColor: '#000000',
          ctaBackgroundColor: '#0077B6',
          ctaFontColor: '#FFFFFF',
        },
      },
      {
        id: 'hope-bold',
        label: 'Hope, Bold',
        colours: {
          backgroundColor: '#0077B6',
          headlineColor: '#FFFFFF',
          guardianLogoColor: '#FFFFFF',
          fontColor: '#FFFFFF',
          ctaBackgroundColor: '#90DCFF',
          ctaFontColor: '#000000',
        },
      },
      {
        id: 'urgency',
        label: 'Urgency, Default',
        colours: {
          backgroundColor: '#F6F6F6',
          headlineColor: '#C70000',
          guardianLogoColor: '#000000',
          fontColor: '#000000',
          ctaBackgroundColor: '#FFE500',
          ctaFontColor: '#000000',
        },
      },
      {
        id: 'empowerment',
        label: 'Empowerment, Default',
        colours: {
          backgroundColor: '#F6F6F6',
          headlineColor: '#BB3B80',
          guardianLogoColor: '#000000',
          fontColor: '#000000',
          ctaBackgroundColor: '#FFE500',
          ctaFontColor: '#000000',
        },
      },
      {
        id: 'empowerment-default-image',
        label: 'Empowerment, Default (Image)',
        colours: {
          backgroundColor: '#BB3B80',
          headlineColor: '#FFFFFF',
          guardianLogoColor: '#FFFFFF',
          fontColor: '#FFFFFF',
          ctaBackgroundColor: '#7D0068',
          ctaFontColor: '#FFFFFF',
        },
      },
      {
        id: 'empowerment-bold',
        label: 'Empowerment, Bold',
        colours: {
          backgroundColor: '#BB3B80',
          headlineColor: '#FFFFFF',
          guardianLogoColor: '#FFFFFF',
          fontColor: '#FFFFFF',
          ctaBackgroundColor: '#FFE500',
          ctaFontColor: '#000000',
        },
      },
    ],
  },
  {
    id: 'Feast Marketing',
    label: 'Feast Marketing',
    themes: [
      {
        id: 'light-turmeric-default',
        label: 'Light Turmeric, Default (Image)',
        colours: {
          backgroundColor: '#FFF1D7',
          headlineColor: '#20201D',
          guardianLogoColor: '#000000',
          fontColor: '#20201D',
          ctaBackgroundColor: '#A36000',
          ctaFontColor: '#FAFAFA',
        },
      },
      {
        id: 'light-turmeric-basil',
        label: 'Light Turmeric, Basil (Image)',
        colours: {
          backgroundColor: '#FFF1D7',
          headlineColor: '#20201D',
          guardianLogoColor: '#000000',
          fontColor: '#20201D',
          ctaBackgroundColor: '#879F84',
          ctaFontColor: '#20201D',
        },
      },
      {
        id: 'light-turmeric-blueberry',
        label: 'Light Turmeric, Blueberry (Image)',
        colours: {
          backgroundColor: '#FFF1D7',
          headlineColor: '#20201D',
          guardianLogoColor: '#000000',
          fontColor: '#20201D',
          ctaBackgroundColor: '#20809E',
          ctaFontColor: '#FAFAFA',
        },
      },
      {
        id: 'light-paprika-default',
        label: 'Light Paprika, Default (Image)',
        colours: {
          backgroundColor: '#F7EFE9',
          headlineColor: '#20201D',
          guardianLogoColor: '#000000',
          fontColor: '#20201D',
          ctaBackgroundColor: '#F56900',
          ctaFontColor: '#20201D',
        },
      },
      {
        id: 'light-paprika-kaffir-a',
        label: 'Light Paprika, Kaffir A (Image)',
        colours: {
          backgroundColor: '#F7EFE9',
          headlineColor: '#20201D',
          guardianLogoColor: '#000000',
          fontColor: '#20201D',
          ctaBackgroundColor: '#BED01E',
          ctaFontColor: '#20201D',
        },
      },
      {
        id: 'light-paprika-kaffir-b',
        label: 'Light Paprika, Kaffir B (Image)',
        colours: {
          backgroundColor: '#F7EFE9',
          headlineColor: '#20201D',
          guardianLogoColor: '#000000',
          fontColor: '#20201D',
          ctaBackgroundColor: '#697311',
          ctaFontColor: '#FAFAFA',
        },
      },
    ],
  },
  {
    id: 'Guardian Weekly',
    label: 'Guardian Weekly',
    themes: [
      {
        id: 'guardian-weekly-dark-image',
        label: 'Dark, Image',
        colours: {
          backgroundColor: '#222527',
          headlineColor: '#F6F6F6',
          guardianLogoColor: '#FFFFFF',
          fontColor: '#F6F6F6',
          ctaBackgroundColor: '#FFD900',
          ctaFontColor: '#000000',
        },
      },
      {
        id: 'guardian-weekly-light-image',
        label: 'Light, Image',
        colours: {
          backgroundColor: '#F6F6F6',
          headlineColor: '#052962',
          guardianLogoColor: '#000000',
          fontColor: '#000000',
          ctaBackgroundColor: '#FFE500',
          ctaFontColor: '#000000',
        },
      },
      {
        id: 'guardian-weekly-brand-image',
        label: 'Brand, Image',
        colours: {
          backgroundColor: '#0077B6',
          headlineColor: '#FFFFFF',
          guardianLogoColor: '#FFFFFF',
          fontColor: '#FFFFFF',
          ctaBackgroundColor: '#052962',
          ctaFontColor: '#FFFFFF',
        },
      },
    ],
  },
  {
    id: 'Marketing',
    label: 'Marketing',
    themes: [
      {
        id: 'marketing-mid-teal',
        label: 'Marketing, Mid Teal',
        colours: {
          backgroundColor: '#65A897',
          headlineColor: '#650054',
          guardianLogoColor: '#000000',
          fontColor: '#000000',
          ctaBackgroundColor: '#650054',
          ctaFontColor: '#FFFFFF',
        },
      },
      {
        id: 'marketing-mid-teal-image',
        label: 'Marketing, Mid Teal (Image)',
        colours: {
          backgroundColor: '#65A897',
          headlineColor: '#650054',
          guardianLogoColor: '#000000',
          fontColor: '#000000',
          ctaBackgroundColor: '#650054',
          ctaFontColor: '#FFFFFF',
        },
      },
      {
        id: 'marketing-bright-orange',
        label: 'Marketing, Bright Orange',
        colours: {
          backgroundColor: '#FF9941',
          headlineColor: '#09615B',
          guardianLogoColor: '#000000',
          fontColor: '#000000',
          ctaBackgroundColor: '#FFE7D4',
          ctaFontColor: '#000000',
        },
      },
      {
        id: 'marketing-bright-orange-image',
        label: 'Marketing, Bright Orange (Image)',
        colours: {
          backgroundColor: '#FF9941',
          headlineColor: '#09615B',
          guardianLogoColor: '#000000',
          fontColor: '#000000',
          ctaBackgroundColor: '#FFE7D4',
          ctaFontColor: '#000000',
        },
      },
      {
        id: 'marketing-deep-purple',
        label: 'Marketing, Deep Purple',
        colours: {
          backgroundColor: '#7D0068',
          headlineColor: '#FF9941',
          guardianLogoColor: '#FFFFFF',
          fontColor: '#F6F6F6',
          ctaBackgroundColor: '#FF9941',
          ctaFontColor: '#000000',
        },
      },
      {
        id: 'marketing-deep-purple-image',
        label: 'Marketing, Deep Purple (Image)',
        colours: {
          backgroundColor: '#7D0068',
          headlineColor: '#FF9941',
          guardianLogoColor: '#FFFFFF',
          fontColor: '#F6F6F6',
          ctaBackgroundColor: '#FF9941',
          ctaFontColor: '#000000',
        },
      },
      {
        id: 'marketing-pale-cyan',
        label: 'Marketing, Pale Cyan',
        colours: {
          backgroundColor: '#A8E3DF',
          headlineColor: '#510043',
          guardianLogoColor: '#000000',
          fontColor: '#000000',
          ctaBackgroundColor: '#510043',
          ctaFontColor: '#FFFFFF',
        },
      },
      {
        id: 'marketing-pale-cyan-image',
        label: 'Marketing, Pale Cyan (Image)',
        colours: {
          backgroundColor: '#A8E3DF',
          headlineColor: '#510043',
          guardianLogoColor: '#000000',
          fontColor: '#000000',
          ctaBackgroundColor: '#510043',
          ctaFontColor: '#FFFFFF',
        },
      },
    ],
  },
  {
    id: 'Guardian App',
    label: 'Guardian App',
    themes: [
      {
        id: 'guardian-app-default-image',
        label: 'Default, Image',
        colours: {
          backgroundColor: '#F6F6F6',
          headlineColor: '#052962',
          guardianLogoColor: '#000000',
          fontColor: '#000000',
          ctaBackgroundColor: '#FF5943',
          ctaFontColor: '#000000',
        },
      },
    ],
  },
];
