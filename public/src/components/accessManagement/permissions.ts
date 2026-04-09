interface Permission {
  name: string;
  displayName: string;
}

export const permissions: Permission[] = [
  {
    name: 'support-landing-page-tests',
    displayName: 'Support Landing Page Tests',
  },
  {
    name: 'checkout-nudge-tests',
    displayName: 'Checkout Nudge Tests',
  },
  {
    name: 'promos-tool',
    displayName: 'Promos Tool',
  },
  {
    name: 'access-management',
    displayName: 'Access Management',
  },
  {
    name: 'student-landing-page-tests',
    displayName: 'Student Landing Page Tests',
  },
  {
    name: 'exclusions',
    displayName: 'Channel Exclusions Settings',
  },
];

export type PermissionName = (typeof permissions)[number]['name'];
