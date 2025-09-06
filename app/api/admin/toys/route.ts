import { NextRequest, NextResponse } from 'next/server';
import { createClientWithServiceRole } from '@/lib/supabase';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    const supabase = createClientWithServiceRole();
    
    // Get toys with pagination
    const { data: toys, error } = await supabase
      .from('toys')
      .select('*')
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      throw error;
    }

    // Get total count
    const { count, error: countError } = await supabase
      .from('toys')
      .select('*', { count: 'exact', head: true });

    return NextResponse.json({
      success: true,
      toys: toys || [],
      total: count || 0,
      limit,
      offset
    });

  } catch (error) {
    console.error('Error fetching toys:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch toys: ' + (error instanceof Error ? error.message : 'Unknown error')
    }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, toyData, toyId } = body;

    const supabase = createClientWithServiceRole();

    switch (action) {
      case 'create':
        const { data: newToy, error: createError } = await supabase
          .from('toys')
          .insert([toyData])
          .select()
          .single();

        if (createError) {
          throw createError;
        }

        return NextResponse.json({
          success: true,
          toy: newToy
        });

      case 'update':
        const { data: updatedToy, error: updateError } = await supabase
          .from('toys')
          .update(toyData)
          .eq('id', toyId)
          .select()
          .single();

        if (updateError) {
          throw updateError;
        }

        return NextResponse.json({
          success: true,
          toy: updatedToy
        });

      case 'delete':
        const { error: deleteError } = await supabase
          .from('toys')
          .delete()
          .eq('id', toyId);

        if (deleteError) {
          throw deleteError;
        }

        return NextResponse.json({
          success: true,
          message: 'Toy deleted successfully'
        });

      default:
        return NextResponse.json({
          success: false,
          error: 'Invalid action'
        }, { status: 400 });
    }

  } catch (error) {
    console.error('Error in toys admin API:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to process request: ' + (error instanceof Error ? error.message : 'Unknown error')
    }, { status: 500 });
  }
}