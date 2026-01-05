import { Users, LayoutDashboard } from "lucide-react";

export const MEMBERSHIP_PLANS = [
  {
    id: 'basic',
    name: 'Basic Fit',
    price: '1000',
    duration: 'month',
    features: [
      'Access to all gym equipment',
      'Locker room access',
      'Standard workout plans',
    ],
    highlight: false,
  },
  {
    id: 'premium',
    name: 'Premium Pro',
    price: '5500',
    duration: '6 months',
    features: [
      'All Basic Fit benefits',
      'Access to group classes',
      'Personalized workout tracker',
      '1x monthly personal training session',
    ],
    highlight: true,
  },
  {
    id: 'vip',
    name: 'VIP Elite',
    price: '10000',
    duration: '12 months',
    features: [
      'All Premium Pro benefits',
      'Unlimited personal training sessions',
      'Access to sauna and spa',
      'Guest passes',
      'Nutritional guidance',
    ],
    highlight: false,
  },
];

export const ADMIN_NAV_LINKS = [
  {
    href: '/admin/memberships',
    label: 'Memberships',
    icon: Users,
  },
  {
    href: '/admin/plans',
    label: 'Plans',
    icon: LayoutDashboard,
  },
];

export type Membership = {
  id: string;
  userName: string;
  userEmail: string;
  planId: 'basic' | 'premium' | 'vip';
  startDate: string;
  endDate: string;
  status: 'active' | 'expired' | 'cancelled';
};

export const MOCK_MEMBERSHIPS: Membership[] = [
  { id: 'm1', userName: 'John Doe', userEmail: 'john.doe@example.com', planId: 'premium', startDate: '2024-05-01', endDate: '2024-06-01', status: 'active' },
  { id: 'm2', userName: 'Jane Smith', userEmail: 'jane.smith@example.com', planId: 'basic', startDate: '2024-04-15', endDate: '2024-05-15', status: 'expired' },
  { id: 'm3', userName: 'Peter Jones', userEmail: 'peter.jones@example.com', planId: 'vip', startDate: '2024-05-10', endDate: '2024-06-10', status: 'active' },
  { id: 'm4', userName: 'Emily White', userEmail: 'emily.white@example.com', planId: 'premium', startDate: '2023-03-01', endDate: '2023-09-01', status: 'cancelled' },
  { id: 'm5', userName: 'Michael Brown', userEmail: 'michael.brown@example.com', planId: 'basic', startDate: '2024-05-20', endDate: '2024-06-20', status: 'active' },
  { id: 'm6', userName: 'Sarah Wilson', userEmail: 'sarah.w@example.com', planId: 'vip', startDate: '2024-05-25', endDate: '2025-05-25', status: 'active' },
];
