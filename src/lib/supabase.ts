import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types for your database tables
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          name: string
          email: string
          phone?: string
          address?: string
          city?: string
          state?: string
          zipcode?: string
          is_admin: boolean
          is_active: boolean
          created_at: string
          updated_at: string
          last_login?: string
        }
        Insert: {
          id?: string
          name: string
          email: string
          phone?: string
          address?: string
          city?: string
          state?: string
          zipcode?: string
          is_admin?: boolean
          is_active?: boolean
          created_at?: string
          updated_at?: string
          last_login?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          phone?: string
          address?: string
          city?: string
          state?: string
          zipcode?: string
          is_admin?: boolean
          is_active?: boolean
          created_at?: string
          updated_at?: string
          last_login?: string
        }
      }
      toys: {
        Row: {
          id: string
          name: string
          description: string
          category: string
          brand: string
          price: number
          age_group: string
          image_url?: string
          images?: string[]
          stock: number
          is_active: boolean
          weight?: number
          dimensions?: string
          safety_rating?: string
          tags?: string[]
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description: string
          category: string
          brand: string
          price: number
          age_group: string
          image_url?: string
          images?: string[]
          stock?: number
          is_active?: boolean
          weight?: number
          dimensions?: string
          safety_rating?: string
          tags?: string[]
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string
          category?: string
          brand?: string
          price?: number
          age_group?: string
          image_url?: string
          images?: string[]
          stock?: number
          is_active?: boolean
          weight?: number
          dimensions?: string
          safety_rating?: string
          tags?: string[]
          created_at?: string
          updated_at?: string
        }
      }
      plans: {
        Row: {
          id: string
          name: string
          description?: string
          price: number
          toys_per_month: number
          features: string[]
          is_popular: boolean
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string
          price: number
          toys_per_month: number
          features: string[]
          is_popular?: boolean
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string
          price?: number
          toys_per_month?: number
          features?: string[]
          is_popular?: boolean
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      orders: {
        Row: {
          id: string
          user_id: string
          plan_id?: string
          status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
          total_amount: number
          shipping_address: string
          billing_address?: string
          payment_method?: string
          payment_status: 'pending' | 'paid' | 'failed' | 'refunded'
          tracking_number?: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          plan_id?: string
          status?: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
          total_amount: number
          shipping_address: string
          billing_address?: string
          payment_method?: string
          payment_status?: 'pending' | 'paid' | 'failed' | 'refunded'
          tracking_number?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          plan_id?: string
          status?: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
          total_amount?: number
          shipping_address?: string
          billing_address?: string
          payment_method?: string
          payment_status?: 'pending' | 'paid' | 'failed' | 'refunded'
          tracking_number?: string
          created_at?: string
          updated_at?: string
        }
      }
      order_items: {
        Row: {
          id: string
          order_id: string
          toy_id: string
          quantity: number
          price_at_time: number
          created_at: string
        }
        Insert: {
          id?: string
          order_id: string
          toy_id: string
          quantity: number
          price_at_time: number
          created_at?: string
        }
        Update: {
          id?: string
          order_id?: string
          toy_id?: string
          quantity?: number
          price_at_time?: number
          created_at?: string
        }
      }
      cart_items: {
        Row: {
          id: string
          user_id: string
          toy_id: string
          quantity: number
          added_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          toy_id: string
          quantity: number
          added_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          toy_id?: string
          quantity?: number
          added_at?: string
          updated_at?: string
        }
      }
      wishlist: {
        Row: {
          id: string
          user_id: string
          toy_id: string
          added_at: string
        }
        Insert: {
          id?: string
          user_id: string
          toy_id: string
          added_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          toy_id?: string
          added_at?: string
        }
      }
      reviews: {
        Row: {
          id: string
          user_id: string
          toy_id: string
          rating: number
          comment?: string
          is_verified_purchase: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          toy_id: string
          rating: number
          comment?: string
          is_verified_purchase?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          toy_id?: string
          rating?: number
          comment?: string
          is_verified_purchase?: boolean
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}