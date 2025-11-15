// Core entity interfaces for the financial management application

export interface User {
  _id: string;
  id?: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  mobile?: string;
  status: 'active' | 'inactive' | 'pending';
  created_at: string;
  user_profile_image?: string;
  short_bio?: string;
  country?: string;
  avatar?: string;
  permissions?: string[];
}

export interface Client {
  _id: string;
  id: string;
  name: string;
  contactName: string;
  email: string;
  phone?: string;
  industry: string;
  status: 'active' | 'inactive' | 'pending';
  finAidsDeployed: number;
  joinDate: string;
  created_at: string;
  avatar?: string;
  profile_id?: string;
  user_id?: string;
  finaid_license_id?: string;
}

export interface FinaidProfile {
  _id: string;
  id: string;
  name: string;
  title?: string;
  description: string;
  desc?: string;
  icon: string;
  image?: string;
  category: string;
  rating: number;
  reviews: number;
  price: string;
  amount: number;
  currency: string;
  frequency: string;
  duration_in_days: number;
  request_limit: number;
  installed: boolean;
  platform?: any;
  model?: any;
  integration?: any;
  created_at: string;
  finaid_profile_id?: string;
  finaid_profile_image?: string;
  finaid_profile_name?: string;
}

export interface License {
  _id: string;
  id?: string;
  finaid_profile_id: string;
  finaid_profile_name?: string;
  finaid_profile_image?: string;
  license_type: 'basic' | 'premium' | 'enterprise';
  license_key?: string;
  status: 'active' | 'inactive' | 'expired' | 'pending';
  frequency: 'monthly' | 'yearly';
  amount: number;
  currency: string;
  validity_days: number;
  user?: User;
  accountant_ID?: string;
}

export interface AccountingFirm {
  _id: string;
  id?: string;
  name: string;
  email?: string;
  phone_code?: string;
  countryCode?: string;
  created_at: string;
  user_profile_image?: string;
}

export interface Content {
  _id?: string;
  id?: string;
  title: string;
  description: string;
  content?: string;
  author: string;
  publishDate: string;
  type: 'video' | 'audio' | 'document' | 'article';
  status: 'published' | 'draft' | 'archived';
  thumbnail?: string;
  views: number;
  avgEngagement: number;
  category: string;
  created_at?: string;
}

// Form state interfaces
export interface NewEmployeeForm {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  permissions?: string[];
  countryCode?: string;
}

export interface NewLicenseForm {
  finaid_profile_id: string;
  name: string;
  description: string;
  amount: number;
  currency: string;
  frequency: string;
  duration_in_days: number;
  request_limit: number;
}

export interface UserProfileForm {
  first_name: string;
  last_name: string;
  email: string;
  short_bio?: string;
  phone: string;
  country: string;
  user_profile_image?: string;
}

// Component prop interfaces
export interface ClientListProps {
  filterStatus: string;
  allClients: Client[];
  isLoading: boolean;
  searchQuery: string;
}

export interface TeamMembersProps {
  accountantList: User[];
}

export interface StudioProps {
  clientId: string;
}

// Chart data interfaces
export interface ChartDataPoint {
  name: string;
  value: number;
  [key: string]: any;
}

// Platform, Model, and Integration interfaces for FinAid profiles
export interface Platform {
  key: string;
  name: string;
  models: Model[];
  integrations: Integration[];
}

export interface Model {
  identifier: string;
  display_name: string;
}

export interface Integration {
  identifier: string;
  display_name: string;
}

// API Response types
export interface APIResponse<T = any> {
  message?: string;
  data?: T;
  response?: T;
  success?: boolean;
  error?: string;
}

// Event handler types
export type FormEventHandler = (e: React.FormEvent) => void;
export type ChangeEventHandler = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
export type SelectEventHandler = (value: string) => void;

// Filter and search types
export interface Filters {
  category?: string;
  status?: string;
  platform?: string;
}

export interface FinaidFilters {
  category: string;
  installed: boolean;
}

// Subscription and billing types
export interface Subscription {
  _id: string;
  id?: string;
  amount: number;
  currency: string;
  frequency: string;
  validity_days: number;
  status: 'active' | 'inactive' | 'expired';
  user?: User;
  license_type: string;
  finaid_profile_id: string;
  finaid_profile_name: string;
  finaid_profile_image?: string;
}

// Ledger and transaction types
export interface Ledger {
  _id: string;
  id?: string;
  type: 'income' | 'expense';
  amount: number;
  description: string;
  date: string;
  category: string;
  status: 'pending' | 'completed';
}

export interface TransactionTableProps {
  filter: 'pending' | 'income' | 'all' | 'expenses';
  ledgerId: string;
}

// Generic utility types
export type StatusType = 'active' | 'inactive' | 'pending' | 'expired';
export type LicenseType = 'basic' | 'premium' | 'enterprise';
export type FrequencyType = 'monthly' | 'yearly' | 'weekly';

// Dropdown and form option types
export interface SelectOption {
  value: string;
  label: string;
}

export interface Country {
  name: string;
  phone_code: string;
  code: string;
}