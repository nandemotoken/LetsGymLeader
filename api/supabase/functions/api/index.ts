const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type'
};

interface RequestBody {
  walletAddress?: string;
}

// @ts-ignore
Deno.serve(async (req) => {
  // OPTIONSリクエストへの対応
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // @ts-ignore
    const apiKey = Deno.env.get('TEST_SECRET')

    // GETリクエストの処理
    if (req.method === 'GET') {
      return new Response(JSON.stringify({
        message: "Hello from Supabase!",
        key: apiKey
      }), {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      });
    }

    // POSTリクエストの処理
    if (req.method === 'POST') {
      const body: RequestBody = await req.json();

      // ウォレットアドレスの存在確認
      if (!body.walletAddress) {
        throw new Error('Wallet address is required');
      }

      // @ts-ignore
      console.log(`body.walletAddress:${body.walletAddress}`)

      // Ethereum アドレスの形式チェック（0xで始まる40文字の16進数）
      const addressRegex = /^0x[a-fA-F0-9]{40}$/;
      if (!addressRegex.test(body.walletAddress)) {
        throw new Error('Invalid wallet address format');
      }

      return new Response(JSON.stringify({
        message: "Hello from Supabase!",
        walletAddress: body.walletAddress,
        key: apiKey
      }), {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      });
    }

    throw new Error('Method not allowed');

  } catch (error) {
    return new Response(JSON.stringify({
      error: error.message
    }), {
      status: 400,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      }
    });
  }
});