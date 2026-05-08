export type Availability = 'available' | 'inquiry' | 'out_of_stock' | 'hidden'
export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'ready_for_pickup'
  | 'completed'
  | 'cancelled'

export interface Database {
  public: {
    Tables: {
      admin_users: {
        Row: {
          id: string
          email: string
          display_name: string | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          display_name?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          display_name?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      categories: {
        Row: {
          id: string
          name: string
          slug: string
          description: string | null
          is_active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          description?: string | null
          is_active?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          description?: string | null
          is_active?: boolean
          created_at?: string
        }
      }
      products: {
        Row: {
          id: string
          category_id: string | null
          name: string
          slug: string
          description: string | null
          price: number
          availability: Availability
          is_active: boolean
          featured: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          category_id?: string | null
          name: string
          slug: string
          description?: string | null
          price: number
          availability?: Availability
          is_active?: boolean
          featured?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          category_id?: string | null
          name?: string
          slug?: string
          description?: string | null
          price?: number
          availability?: Availability
          is_active?: boolean
          featured?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      product_images: {
        Row: {
          id: string
          product_id: string
          url: string
          alt: string | null
          sort_order: number
          created_at: string
        }
        Insert: {
          id?: string
          product_id: string
          url: string
          alt?: string | null
          sort_order?: number
          created_at?: string
        }
        Update: {
          id?: string
          product_id?: string
          url?: string
          alt?: string | null
          sort_order?: number
          created_at?: string
        }
      }
      orders: {
        Row: {
          id: string
          order_code: string
          customer_name: string
          customer_phone: string
          customer_message: string | null
          total: number
          status: OrderStatus
          whatsapp_message: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          order_code: string
          customer_name: string
          customer_phone: string
          customer_message?: string | null
          total: number
          status?: OrderStatus
          whatsapp_message?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          order_code?: string
          customer_name?: string
          customer_phone?: string
          customer_message?: string | null
          total?: number
          status?: OrderStatus
          whatsapp_message?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      order_items: {
        Row: {
          id: string
          order_id: string
          product_id: string | null
          product_name: string
          unit_price: number
          quantity: number
          subtotal: number
          created_at: string
        }
        Insert: {
          id?: string
          order_id: string
          product_id?: string | null
          product_name: string
          unit_price: number
          quantity: number
          subtotal: number
          created_at?: string
        }
        Update: {
          id?: string
          order_id?: string
          product_id?: string | null
          product_name?: string
          unit_price?: number
          quantity?: number
          subtotal?: number
          created_at?: string
        }
      }
      store_settings: {
        Row: {
          id: string
          store_name: string
          whatsapp_phone: string
          instagram_url: string | null
          address: string | null
          opening_hours: string | null
          checkout_message: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          store_name: string
          whatsapp_phone: string
          instagram_url?: string | null
          address?: string | null
          opening_hours?: string | null
          checkout_message?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          store_name?: string
          whatsapp_phone?: string
          instagram_url?: string | null
          address?: string | null
          opening_hours?: string | null
          checkout_message?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: Record<string, never>
    Functions: {
      create_order_with_items: {
        Args: {
          p_order_code: string
          p_customer_name: string
          p_customer_phone: string
          p_customer_message?: string | null
          p_whatsapp_message?: string | null
          p_items: {
            product_id: string
            quantity: number
          }[]
        }
        Returns: {
          order_id: string
          order_code: string
          total: number
          whatsapp_message: string | null
        }[]
      }
    }
    Enums: Record<string, never>
    CompositeTypes: Record<string, never>
  }
}

export type CategoryRow = Database['public']['Tables']['categories']['Row']
export type ProductRow = Database['public']['Tables']['products']['Row']
export type ProductImageRow = Database['public']['Tables']['product_images']['Row']
export type OrderRow = Database['public']['Tables']['orders']['Row']
export type OrderItemRow = Database['public']['Tables']['order_items']['Row']
export type StoreSettingsRow = Database['public']['Tables']['store_settings']['Row']
