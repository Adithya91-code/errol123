export type UserRole = 'farmer' | 'distributor' | 'retailer' | 'consumer' | 'admin';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  created_at: string;
  farmer_id?: string;
  distributor_id?: string;
  name?: string;
  location?: string;
}

export interface FarmerInfo {
  farmer_id: string;
  name: string;
  location: string;
}

export interface DistributorInfo {
  distributor_id: string;
  name: string;
  location: string;
  received_date: string;
}

export interface RetailerInfo {
  retailer_id?: string;
  name?: string;
  location: string;
  received_date: string;
}

export interface Crop {
  id: string;
  user_id: string;
  name: string;
  crop_type: string;
  harvest_date: string;
  expiry_date: string;
  soil_type: string;
  pesticides_used: string;
  image_url?: string;
  created_at: string;
  farmer_info?: FarmerInfo;
  distributor_info?: DistributorInfo;
  retailer_info?: RetailerInfo;
}
