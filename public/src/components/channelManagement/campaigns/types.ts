export interface Campaign {
  name: string;
  nickname: string;
  description?: string;
  notes?: string[];
  isActive?: boolean;
}

export type Campaigns = Campaign[];

export const unassignedCampaign = {
  name: 'NOT_IN_CAMPAIGN',
  nickname: 'TESTS NOT IN A CAMPAIGN',
  description: 'Tests not assigned to a campaign',
};
