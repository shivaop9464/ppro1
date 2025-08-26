import { supabase } from './supabase'
import type { Database } from './supabase'

// Types for convenience
type Toy = Database['public']['Tables']['toys']['Row']
type Plan = Database['public']['Tables']['plans']['Row']
type User = Database['public']['Tables']['users']['Row']
type CartItem = Database['public']['Tables']['cart_items']['Row']
type Order = Database['public']['Tables']['orders']['Row']

export class SupabaseService {
  // ================== AUTH METHODS ==================
  
  async signInWithGoogle() {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`
      }
    })
    return { data, error }
  }

  async signInWithFacebook() {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'facebook',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`
      }
    })
    return { data, error }
  }

  async signInWithApple() {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'apple',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`
      }
    })
    return { data, error }
  }

  async signOut() {
    const { error } = await supabase.auth.signOut()
    return { error }
  }

  async getCurrentUser() {
    const { data: { user } } = await supabase.auth.getUser()
    return user
  }

  async getCurrentUserProfile() {
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
    const { data, error } = await supabase
      .from('toys')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false })
    
    return { data, error }
  }

  async getToyById(id: string) {
    const { data, error } = await supabase
      .from('toys')
      .select('*')
      .eq('id', id)
      .eq('is_active', true)
      .single()
    
    return { data, error }
  }

  async getToysByCategory(category: string) {
    const { data, error } = await supabase
      .from('toys')
      .select('*')
      .eq('category', category)
      .eq('is_active', true)
      .order('created_at', { ascending: false })
    
    return { data, error }
  }

  async searchToys(query: string) {
    const { data, error } = await supabase
      .from('toys')
      .select('*')
      .or(`name.ilike.%${query}%,description.ilike.%${query}%,brand.ilike.%${query}%`)
      .eq('is_active', true)
      .order('created_at', { ascending: false })
    
    return { data, error }
  }

  // ================== PLANS METHODS ==================
  
  async getAllPlans() {
    const { data, error } = await supabase
      .from('plans')
      .select('*')
      .eq('is_active', true)
      .order('price', { ascending: true })
    
    return { data, error }
  }

  async getPlanById(id: string) {
    const { data, error } = await supabase
      .from('plans')
      .select('*')
      .eq('id', id)
      .eq('is_active', true)
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
          brand,
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
          brand,
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

  async createToy(toyData: any) {
    const isAdmin = await this.isAdmin()
    if (!isAdmin) throw new Error('Admin access required')

    const { data, error } = await supabase
      .from('toys')
      .insert(toyData)
      .select()
      .single()
    
    return { data, error }
  }

  async updateToy(id: string, toyData: any) {
    const isAdmin = await this.isAdmin()
    if (!isAdmin) throw new Error('Admin access required')

    const { data, error } = await supabase
      .from('toys')
      .update(toyData)
      .eq('id', id)
      .select()
      .single()
    
    return { data, error }
  }

  async deleteToy(id: string) {
    const isAdmin = await this.isAdmin()
    if (!isAdmin) throw new Error('Admin access required')

    const { error } = await supabase
      .from('toys')
      .update({ is_active: false })
      .eq('id', id)
    
    return { error }
  }
}

// Export singleton instance
export const supabaseService = new SupabaseService()