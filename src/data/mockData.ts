
export interface User {
  id: string;
  name: string;
  email: string;
  password: string; // In a real app, this would be hashed
}

export interface Document {
  id: string;
  userId: string;
  name: string;
  type: string;
  size: number;
  sensitivity: 'high' | 'medium' | 'low';
  uploadedAt: string;
  url: string;
}

export const mockUsers: User[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    password: 'password123',
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    password: 'password123',
  },
];

export const mockDocuments: Document[] = [
  {
    id: '1',
    userId: '1',
    name: 'Passport Copy.pdf',
    type: 'application/pdf',
    size: 1024000,
    sensitivity: 'high',
    uploadedAt: '2025-04-26T10:30:00Z',
    url: '/placeholder.svg',
  },
  {
    id: '2',
    userId: '1',
    name: 'Bank Statement.pdf',
    type: 'application/pdf',
    size: 512000,
    sensitivity: 'medium',
    uploadedAt: '2025-04-25T15:45:00Z',
    url: '/placeholder.svg',
  },
  {
    id: '3',
    userId: '1',
    name: 'Certificate.pdf',
    type: 'application/pdf',
    size: 256000,
    sensitivity: 'low',
    uploadedAt: '2025-04-24T08:15:00Z',
    url: '/placeholder.svg',
  },
  {
    id: '4',
    userId: '1',
    name: 'Medical Records.pdf',
    type: 'application/pdf',
    size: 2048000,
    sensitivity: 'high',
    uploadedAt: '2025-04-23T14:20:00Z',
    url: '/placeholder.svg',
  },
  {
    id: '5',
    userId: '1',
    name: 'Utility Bill.pdf',
    type: 'application/pdf',
    size: 384000,
    sensitivity: 'medium',
    uploadedAt: '2025-04-22T11:10:00Z',
    url: '/placeholder.svg',
  },
];
