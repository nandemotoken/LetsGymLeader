const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type'
};

// @ts-ignore
Deno.serve(async (req) => {
  // OPTIONSリクエストへの対応
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  // @ts-ignore
  const apiKey = Deno.env.get('TEST_SECRET')
  
  return new Response(JSON.stringify({
    message: "Hello from Supabase!",
    key: apiKey
  }), {
    headers: { 
      ...corsHeaders,
      'Content-Type': 'application/json'
    }
  })
})