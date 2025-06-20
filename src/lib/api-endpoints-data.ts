
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
    id: 'get-user-details',
    name: 'Get User Details',
    description: 'Retrieves details for a specific user.',
    method: 'GET',
    path: '/v1/users/{userId}',
    parameters: [
      { name: 'userId', type: 'string', required: true, description: 'The unique identifier for the user.', placeholder: 'user_123' },
    ],
  },
  {
    id: 'list-products',
    name: 'List Products',
    description: 'Retrieves a list of available products.',
    method: 'GET',
    path: '/v1/products',
    parameters: [
      { name: 'limit', type: 'number', required: false, description: 'Maximum number of products to return.', placeholder: '10' },
      { name: 'offset', type: 'number', required: false, description: 'Number of products to skip before returning results.', placeholder: '0' },
      { name: 'category', type: 'string', required: false, description: 'Filter products by category.', placeholder: 'electronics' },
    ],
  },
  {
    id: 'create-order',
    name: 'Create Order',
    description: 'Creates a new order with the specified items.',
    method: 'POST',
    path: '/v1/orders',
    parameters: [], // No URL parameters
    bodyParameters: [ // Parameters for the request body
      { name: 'customerId', type: 'string', required: true, description: 'The ID of the customer placing the order.', placeholder: 'cust_abc' },
      { name: 'items', type: 'array', required: true, description: 'An array of items to include in the order. Each item object should have productId and quantity.', placeholder: '[{ "productId": "prod_xyz", "quantity": 2 }]' },
      { name: 'shippingAddress', type: 'string', required: true, description: 'The shipping address for the order.', placeholder: '123 Main St, Anytown USA' },
    ],
  },
  {
    id: 'update-inventory',
    name: 'Update Inventory',
    description: 'Updates the stock level for a product.',
    method: 'PUT',
    path: '/v1/products/{productId}/inventory',
    parameters: [
        { name: 'productId', type: 'string', required: true, description: 'The unique identifier for the product.', placeholder: 'prod_xyz' },
    ],
    bodyParameters: [
      { name: 'quantity', type: 'number', required: true, description: 'The new stock quantity.', placeholder: '100' },
      { name: 'locationId', type: 'string', required: false, description: 'Warehouse location ID.', placeholder: 'wh_1' },
    ],
  },
  {
    id: 'delete-customer',
    name: 'Delete Customer',
    description: 'Deletes a specific customer account.',
    method: 'DELETE',
    path: '/v1/customers/{customerId}',
    parameters: [
      { name: 'customerId', type: 'string', required: true, description: 'The unique identifier for the customer to delete.', placeholder: 'cust_abc' },
    ],
  },
];
