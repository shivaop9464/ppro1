import { supabase } from './supabase'
import type { Database } from './supabase'

// Types for convenience
type Toy = Database['public']['Tables']['toys']['Row']
type Plan = Database['public']['Tables']['plans']['Row']
type User = Database['public']['Tables']['users']['Row']
type CartItem = Database['public']['Tables']['cart_items']['Row']
type Order = Database['public']['Tables']['orders']['Row']

export class SupabaseService {
  // Helper method to check if Supabase is properly configured
  private isSupabaseConfigured() {
    if (!supabase) {
      console.warn('Supabase is not configured. Please check your environment variables.')
      return false
    }
    return true
  }

  // ================== AUTH METHODS ==================
  
  async signUp(email: string, password: string, name: string) {
    if (!this.isSupabaseConfigured()) {
      return { data: null, error: { message: 'Supabase is not configured' } }
    }
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: name
        }
      }
    })
    return { data, error }
  }

  async signIn(email: string, password: string) {
    if (!this.isSupabaseConfigured()) {
      return { data: null, error: { message: 'Supabase is not configured' } }
    }
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    return { data, error }
  }

  async signOut() {
    if (!this.isSupabaseConfigured()) {
      return { error: { message: 'Supabase is not configured' } }
    }
    
    const { error } = await supabase.auth.signOut()
    return { error }
  }

  async getCurrentUser() {
    if (!this.isSupabaseConfigured()) {
      return null
    }
    
    const { data: { user } } = await supabase.auth.getUser()
    return user
  }

  async getCurrentUserProfile() {
    if (!this.isSupabaseConfigured()) {
      return { data: null, error: { message: 'Supabase is not configured' } }
    }
    
    const user = await this.getCurrentUser()
    if (!user) return null

    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single()
    
    return { data, error }
  }

  // ================== TOYS/PRODUCTS METHODS ==================
  
  async getAllToys() {
    try {
      // First, try to get toys from database if Supabase is configured
      let dbToys = null
      let error = null
      
      if (this.isSupabaseConfigured()) {
        const result = await supabase
          .from('toys')
          .select('*')
          .order('created_at', { ascending: false })
        
        dbToys = result.data
        error = result.error
      }
      
      let allToys = dbToys || []
      
      // If database fetch fails or returns empty, also try to load from JSON file
      if (error || !dbToys || dbToys.length === 0) {
        console.log('Database toys fetch failed or empty, trying JSON fallback:', error)
        
        try {
          // Try to fetch from JSON file as fallback
          const response = await fetch('/api/toys-fallback')
          if (response.ok) {
            const jsonData = await response.json()
            if (jsonData.success && jsonData.toys) {
              const convertedToys = jsonData.toys.map((toy: any) => ({
                ...toy,
                age_group: toy.ageGroup || toy.age_group,
                image_url: toy.imageUrl || toy.image_url,
                is_active: true,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
              }))
              allToys = [...allToys, ...convertedToys]
            }
          }
        } catch (jsonError) {
          console.log('JSON fallback also failed:', jsonError)
        }
      }
      
      return { data: allToys, error: allToys.length > 0 ? null : error }
    } catch (err) {
      console.error('Error in getAllToys:', err)
      return { data: null, error: err }
    }
  }

  async getToyById(id: string) {
    if (!this.isSupabaseConfigured()) {
      // Fallback to JSON API
      try {
        const response = await fetch(`/api/toys-fallback?id=${id}`)
        if (response.ok) {
          const jsonData = await response.json()
          if (jsonData.success && jsonData.toy) {
            return { 
              data: {
                ...jsonData.toy,
                age_group: jsonData.toy.ageGroup || jsonData.toy.age_group,
                image_url: jsonData.toy.imageUrl || jsonData.toy.image_url,
                is_active: true,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
              }, 
              error: null 
            }
          }
        }
      } catch (err) {
        console.error('Error fetching toy from fallback:', err)
      }
      return { data: null, error: { message: 'Supabase not configured and fallback failed' } }
    }
    
    const { data, error } = await supabase
      .from('toys')
      .select('*')
      .eq('id', id)
      .single()
    
    return { data, error }
  }

  async getToysByCategory(category: string) {
    if (!this.isSupabaseConfigured()) {
      return { data: null, error: { message: 'Supabase is not configured' } }
    }
    
    const { data, error } = await supabase
      .from('toys')
      .select('*')
      .eq('category', category)
      .order('created_at', { ascending: false })
    
    return { data, error }
  }

  async searchToys(query: string) {
    if (!this.isSupabaseConfigured()) {
      return { data: null, error: { message: 'Supabase is not configured' } }
    }
    
    const { data, error } = await supabase
      .from('toys')
      .select('*')
      .or(`name.ilike.%${query}%,description.ilike.%${query}%`)
      .order('created_at', { ascending: false })
    
    return { data, error }
  }

  async createToy(toyData: any) {
    console.log('Creating toy with data:', toyData)
    
    // Validate required fields
    if (!toyData.name || !toyData.category || !toyData.price) {
      return { data: null, error: { message: 'Missing required fields: name, category, price' } }
    }
    
    if (!this.isSupabaseConfigured()) {
      return { data: null, error: { message: 'Supabase is not configured' } }
    }
    
    const { data, error } = await supabase
      .from('toys')
      .insert([toyData])
      .select()
      .single()
    
    console.log('Create toy result:', { data, error })
    return { data, error }
  }

  async updateToy(id: string, toyData: any) {
    console.log('Updating toy with ID:', id, 'data:', toyData)
    
    if (!id) {
      return { data: null, error: { message: 'Toy ID is required' } }
    }
    
    if (!this.isSupabaseConfigured()) {
      return { data: null, error: { message: 'Supabase is not configured' } }
    }
    
    const { data, error } = await supabase
      .from('toys')
      .update(toyData)
      .eq('id', id)
      .select()
      .single()
    
    console.log('Update toy result:', { data, error })
    return { data, error }
  }

  async deleteToy(id: string) {
    if (!this.isSupabaseConfigured()) {
      return { data: null, error: { message: 'Supabase is not configured' } }
    }
    
    const { data, error } = await supabase
      .from('toys')
      .delete()
      .eq('id', id)
      .select()
      .single()
    
    return { data, error }
  }

  // ================== PLANS METHODS ==================
  
  async getAllPlans() {
    if (!this.isSupabaseConfigured()) {
      // Fallback to JSON data
      try {
        const response = await fetch('/data/plans.json')
        if (response.ok) {
          const plans = await response.json()
          return { data: plans, error: null }
        }
      } catch (err) {
        console.error('Error fetching plans from JSON:', err)
      }
      return { data: null, error: { message: 'Supabase not configured and fallback failed' } }
    }
    
    const { data, error } = await supabase
      .from('plans')
      .select('*')
      .order('price', { ascending: true })
    
    return { data, error }
  }

  async getPlanById(id: string) {
    if (!this.isSupabaseConfigured()) {
      // Fallback to JSON data
      try {
        const response = await fetch('/data/plans.json')
        if (response.ok) {
          const plans = await response.json()
          const plan = plans.find((p: any) => p.id === id)
          return { data: plan, error: null }
        }
      } catch (err) {
        console.error('Error fetching plan from JSON:', err)
      }
      return { data: null, error: { message: 'Supabase not configured and fallback failed' } }
    }
    
    const { data, error } = await supabase
      .from('plans')
      .select('*')
      .eq('id', id)
      .single()
    
    return { data, error }
  }

  // ================== CART METHODS ==================
  
  async getCartItems() {
    const user = await this.getCurrentUser()
    if (!user) throw new Error('User not authenticated')

    const { data, error } = await supabase
      .from('cart_items')
      .select(`
        *,
        toys (
          id,
          name,
          description,
          age_group,
          category,
          image_url,
          price,
          stock,
          tags
        )
      `)
      .eq('user_id', user.id)
    
    return { data, error }
  }

  async addToCart(toyId: string, quantity: number = 1) {
    const user = await this.getCurrentUser()
    if (!user) throw new Error('User not authenticated')

    // Check if item already exists in cart
    const { data: existingItem } = await supabase
      .from('cart_items')
      .select('*')
      .eq('user_id', user.id)
      .eq('toy_id', toyId)
      .single()

    if (existingItem) {
      // Update quantity
      const { data, error } = await supabase
        .from('cart_items')
        .update({ 
          quantity: existingItem.quantity + quantity,
          updated_at: new Date().toISOString()
        })
        .eq('id', existingItem.id)
        .select()
        .single()
      
      return { data, error }
    } else {
      // Insert new item
      const { data, error } = await supabase
        .from('cart_items')
        .insert({
          user_id: user.id,
          toy_id: toyId,
          quantity
        })
        .select()
        .single()
      
      return { data, error }
    }
  }

  async updateCartItemQuantity(itemId: string, quantity: number) {
    const { data, error } = await supabase
      .from('cart_items')
      .update({ 
        quantity,
        updated_at: new Date().toISOString()
      })
      .eq('id', itemId)
      .select()
      .single()
    
    return { data, error }
  }

  async removeFromCart(itemId: string) {
    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('id', itemId)
    
    return { error }
  }

  async clearCart() {
    const user = await this.getCurrentUser()
    if (!user) throw new Error('User not authenticated')

    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('user_id', user.id)
    
    return { error }
  }

  // ================== WISHLIST METHODS ==================
  
  async getWishlist() {
    const user = await this.getCurrentUser()
    if (!user) throw new Error('User not authenticated')

    const { data, error } = await supabase
      .from('wishlist')
      .select(`
        *,
        toys (
          id,
          name,
          price,
          image_url,
          category
        )
      `)
      .eq('user_id', user.id)
    
    return { data, error }
  }

  async addToWishlist(toyId: string) {
    const user = await this.getCurrentUser()
    if (!user) throw new Error('User not authenticated')

    const { data, error } = await supabase
      .from('wishlist')
      .insert({
        user_id: user.id,
        toy_id: toyId
      })
      .select()
      .single()
    
    return { data, error }
  }

  async removeFromWishlist(toyId: string) {
    const user = await this.getCurrentUser()
    if (!user) throw new Error('User not authenticated')

    const { error } = await supabase
      .from('wishlist')
      .delete()
      .eq('user_id', user.id)
      .eq('toy_id', toyId)
    
    return { error }
  }

  // ================== ORDERS METHODS ==================
  
  async createOrder(orderData: {
    planId?: string
    totalAmount: number
    shippingAddress: any
    cartItems: any[]
  }) {
    const user = await this.getCurrentUser()
    if (!user) throw new Error('User not authenticated')

    // Start a transaction
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        user_id: user.id,
        plan_id: orderData.planId,
        total_amount: orderData.totalAmount,
        shipping_address: orderData.shippingAddress,
        status: 'pending'
      })
      .select()
      .single()

    if (orderError) return { data: null, error: orderError }

    // Insert order items
    const orderItems = orderData.cartItems.map(item => ({
      order_id: order.id,
      toy_id: item.toy_id,
      quantity: item.quantity,
      price_at_time: item.toys.price
    }))

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems)

    if (itemsError) return { data: null, error: itemsError }

    // Clear cart after successful order
    await this.clearCart()

    return { data: order, error: null }
  }

  async getUserOrders() {
    const user = await this.getCurrentUser()
    if (!user) throw new Error('User not authenticated')

    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (
          *,
          toys (
            id,
            name,
            image_url,
            brand
          )
        )
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
    
    return { data, error }
  }

  // ================== REVIEWS METHODS ==================
  
  async getToyReviews(toyId: string) {
    const { data, error } = await supabase
      .from('reviews')
      .select(`
        *,
        users (
          name
        )
      `)
      .eq('toy_id', toyId)
      .order('created_at', { ascending: false })
    
    return { data, error }
  }

  async addReview(toyId: string, rating: number, comment?: string) {
    const user = await this.getCurrentUser()
    if (!user) throw new Error('User not authenticated')

    const { data, error } = await supabase
      .from('reviews')
      .insert({
        user_id: user.id,
        toy_id: toyId,
        rating,
        comment,
        is_verified_purchase: true // You might want to check this based on actual purchases
      })
      .select()
      .single()
    
    return { data, error }
  }

  // ================== CONTACT METHODS ==================
  
  async submitContactMessage(messageData: {
    name: string
    email: string
    subject: string
    message: string
  }) {
    const { data, error } = await supabase
      .from('contact_messages')
      .insert(messageData)
      .select()
      .single()
    
    return { data, error }
  }

  // ================== ADMIN METHODS ==================
  
  async isAdmin() {
    const result = await this.getCurrentUserProfile()
    return result?.data?.is_admin || false
  }

  async getAllUsers() {
    const isAdmin = await this.isAdmin()
    if (!isAdmin) throw new Error('Admin access required')

    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false })
    
    return { data, error }
  }

  async getAllOrders() {
    const isAdmin = await this.isAdmin()
    if (!isAdmin) throw new Error('Admin access required')

    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        users (
          name,
          email
        ),
        order_items (
          *,
          toys (
            name
          )
        )
      `)
      .order('created_at', { ascending: false })
    
    return { data, error }
  }
}

// Export singleton instance
export const supabaseService = new SupabaseService()