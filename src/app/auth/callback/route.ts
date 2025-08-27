import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  
  if (code) {
    try {
      const { data, error } = await supabase.auth.exchangeCodeForSession(code);
      
      if (error) {
        console.error('OAuth callback error:', error);
        return NextResponse.redirect(`${origin}/login?error=oauth_error`);
      }
      
      if (data.user) {
        // Try to create user profile if it doesn't exist
        const { error: profileError } = await supabase
          .from('users')
          .upsert([
            {
              id: data.user.id,
              name: data.user.user_metadata?.full_name || data.user.user_metadata?.name || 'User',
              email: data.user.email,
              is_admin: false,
              is_active: true,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            }
          ]);
        
        if (profileError) {
          console.error('Error creating user profile:', profileError);
          // Continue anyway, profile creation isn't critical
        }
        
        return NextResponse.redirect(`${origin}/`);
      }
    } catch (error) {
      console.error('OAuth exchange error:', error);
    }
  }
  
  return NextResponse.redirect(`${origin}/login?error=oauth_error`);
}