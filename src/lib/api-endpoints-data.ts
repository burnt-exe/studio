
export interface ApiParameter {
  name: string;
  type: string;
  required: boolean;
  description: string;
  placeholder?: string;
}

export interface ApiEndpoint {
  id: string;
  name: string;
  description: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  path: string;
  parameters: ApiParameter[];
  bodyParameters?: ApiParameter[]; // For POST/PUT requests
}

export const apiEndpointsData: ApiEndpoint[] = [
  {
    id: 'get-performance-report',
    name: 'Get Performance Report',
    description: 'Retrieves performance reports from Impact.com, including clicks, conversions, and revenue.',
    method: 'GET',
    path: '/Advertisers/{CampaignId}/Reports',
    parameters: [
      { name: 'CampaignId', type: 'string', required: true, description: 'The unique identifier for the campaign.', placeholder: '1234' },
      { name: 'StartDate', type: 'string', required: true, description: 'Start date for the report.', placeholder: 'YYYY-MM-DD' },
      { name: 'EndDate', type: 'string', required: true, description: 'End date for the report.', placeholder: 'YYYY-MM-DD' },
      { name: 'SubAID', type: 'string', required: false, description: 'Filter by a specific SubAID.', placeholder: 'sub_id_1' },
    ],
  },
  {
    id: 'list-media-partners',
    name: 'List Media Partners',
    description: 'Retrieves a list of all associated media partners from your Impact.com account.',
    method: 'GET',
    path: '/MediaPartners',
    parameters: [
      { name: 'PageSize', type: 'number', required: false, description: 'The number of results to return per page.', placeholder: '100' },
      { name: 'Page', type: 'number', required: false, description: 'The page number of the results.', placeholder: '1' },
    ],
  },
  {
    id: 'get-conversions',
    name: 'Get Conversions',
    description: 'Retrieves detailed conversion data from Impact.com for a specified date range.',
    method: 'GET',
    path: '/Conversions',
    parameters: [
      { name: 'StartDate', type: 'string', required: true, description: 'Start date and time for the conversion data.', placeholder: 'YYYY-MM-DDTHH:MM:SSZ' },
      { name: 'EndDate', type: 'string', required: true, description: 'End date and time for the conversion data.', placeholder: 'YYYY-MM-DDTHH:MM:SSZ' },
      { name: 'ActionTrackerId', type: 'string', required: false, description: 'Filter by a specific Action Tracker ID.', placeholder: '5678' },
    ],
  },
  {
    id: 'get-payouts',
    name: 'Get Payouts',
    description: 'Retrieves payout and commission information for your partners from Impact.com.',
    method: 'GET',
    path: '/Payouts',
    parameters: [
      { name: 'StartDate', type: 'string', required: true, description: 'The start date for the payout period.', placeholder: 'YYYY-MM-DD' },
      { name: 'EndDate', type: 'string', required: true, description: 'The end date for the payout period.', placeholder: 'YYYY-MM-DD' },
    ],
  },
];
