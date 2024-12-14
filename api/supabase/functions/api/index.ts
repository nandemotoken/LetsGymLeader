//@ts-ignore
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const supabaseClient = createClient(
  //@ts-ignore
  Deno.env.get('SUPABASE_URL') || '',
  //@ts-ignore
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
);


const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type'
};

interface RequestBody {
  walletAddress?: string;
  discordUsername?: string;
}
// Discordにメッセージを送信する関数
async function sendDiscordNotification(message: string) {
  // @ts-ignore
  const webhookUrl = Deno.env.get('DISCORD_WEBHOOK_URL'); // Discord webhook URLを環境変数から取得
  
  if (!webhookUrl) {
    throw new Error('Discord webhook URL is not configured');
  }

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        content: message,
      }),
    });

    if (!response.ok) {
      throw new Error(`Discord notification failed: ${response.statusText}`);
    }
  } catch (error) {
    console.error('Error sending Discord notification:', error);
    throw error;
  }
}

// @ts-ignore
Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // @ts-ignore
    const apiKey = Deno.env.get('TEST_SECRET')

    if (req.method === 'GET') {
      await sendDiscordNotification('GET request received!');
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

    if (req.method === 'POST') {
      const body: RequestBody = await req.json();

      if (!body.walletAddress) {
        throw new Error('Wallet address is required');
      }

      const addressRegex = /^0x[a-fA-F0-9]{40}$/;
      if (!addressRegex.test(body.walletAddress)) {
        throw new Error('Invalid wallet address format');
      }

      // Discord通知を送信
      await sendDiscordNotification(`新しい挑戦者がジムに来ました！\nアドレス: ${body.walletAddress}\n名前: ${body.discordUsername || 'Unknown'}`);

      // データベースの値を確認
      const { data, error } = await supabaseClient
        .from('gym_leaders')
        .select('*')
        .eq('id', 1)
        .single();
      
      console.log('Database response:', { data, error });

      return new Response(JSON.stringify({
        message: "Hello from Supabase!",
        walletAddress: body.walletAddress,
        discordUsername: body.discordUsername,
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
    // エラーの場合もDiscordに通知
    try {
      await sendDiscordNotification(`エラーが発生しました: ${error.message}`);
    } catch (discordError) {
      console.error('Failed to send error notification to Discord:', discordError);
    }

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