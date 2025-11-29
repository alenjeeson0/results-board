import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.86.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );

    // Get query parameters
    const url = new URL(req.url);
    const searchTerm = url.searchParams.get('search') || '';
    const event = url.searchParams.get('event') || '';
    const category = url.searchParams.get('category') || '';

    console.log('Fetching results with filters:', { searchTerm, event, category });

    // Build query - sort by event first, then rank within each event
    let query = supabase
      .from('results')
      .select('*')
      .order('event', { ascending: true })
      .order('rank', { ascending: true, nullsFirst: false });

    // Apply filters
    if (searchTerm) {
      query = query.or(`participant_id.ilike.%${searchTerm}%,participant_name.ilike.%${searchTerm}%`);
    }
    if (event) {
      query = query.eq('event', event);
    }
    if (category) {
      query = query.eq('category', category);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching results:', error);
      return new Response(
        JSON.stringify({ error: error.message }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    console.log(`Successfully fetched ${data?.length || 0} results`);

    return new Response(
      JSON.stringify({ results: data || [] }),
      { 
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  } catch (error) {
    console.error('Unexpected error:', error);
    const message = error instanceof Error ? error.message : 'An unexpected error occurred';
    return new Response(
      JSON.stringify({ error: message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});