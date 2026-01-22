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
    name: 'access-management',
    displayName: 'Access Management',
  },
  {
    name: 'student-landing-page-tests',
    displayName: 'Student Landing Page Tests',
  },
];

export type PermissionName = (typeof permissions)[number]['name'];
