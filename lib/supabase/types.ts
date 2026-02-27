export type UserRole = "admin" | "customer";

export type ProfileRow = {
  id: string;
  full_name: string | null;
  role: UserRole;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
};

export type BusinessRow = {
  id: string;
  owner_id: string;
  slug: string;
  name: string;
  description: string | null;
  logo_url: string | null;
  city: string | null;
  country: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type ProductRow = {
  id: string;
  business_id: string;
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type LoyaltyCardRow = {
  id: string;
  customer_id: string;
  business_id: string;
  points: number;
  qr_token: string;
  last_scanned_at: string | null;
  created_at: string;
  updated_at: string;
};

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: ProfileRow;
        Insert: {
          id: string;
          full_name?: string | null;
          role?: UserRole;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          full_name?: string | null;
          role?: UserRole;
          avatar_url?: string | null;
          updated_at?: string;
        };
      };
      businesses: {
        Row: BusinessRow;
        Insert: {
          id?: string;
          owner_id: string;
          slug: string;
          name: string;
          description?: string | null;
          logo_url?: string | null;
          city?: string | null;
          country?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          slug?: string;
          name?: string;
          description?: string | null;
          logo_url?: string | null;
          city?: string | null;
          country?: string | null;
          is_active?: boolean;
          updated_at?: string;
        };
      };
      products: {
        Row: ProductRow;
        Insert: {
          id?: string;
          business_id: string;
          name: string;
          description?: string | null;
          price: number;
          image_url?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          name?: string;
          description?: string | null;
          price?: number;
          image_url?: string | null;
          is_active?: boolean;
          updated_at?: string;
        };
      };
      loyalty_cards: {
        Row: LoyaltyCardRow;
        Insert: {
          id?: string;
          customer_id: string;
          business_id: string;
          points?: number;
          qr_token?: string;
          last_scanned_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          points?: number;
          last_scanned_at?: string | null;
          updated_at?: string;
        };
      };
    };
    Views: Record<string, never>;
    Functions: {
      increment_loyalty_points: {
        Args: {
          p_business_id: string;
          p_qr_token: string;
          p_points_to_add?: number;
        };
        Returns: LoyaltyCardRow;
      };
    };
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
