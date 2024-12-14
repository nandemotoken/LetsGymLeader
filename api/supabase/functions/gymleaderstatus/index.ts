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
  gymLeaderId?: number;
}

interface GymLeaderStatus {
  isAvailable: boolean;
  message: string;
  walletAddress?: string;
}

// ジムリーダーの状態を確認する関数
async function checkGymLeaderStatus(gymLeaderId: number): Promise<GymLeaderStatus> {
  const { data, error } = await supabaseClient
    .from('gym_leaders')
    .select('*')
    .eq('id', gymLeaderId)
    .single();
  
  if (error) throw error;
  
  return {
    isAvailable: data.is_available,
    message: data.is_available ? 
      "ジムリーダーは現在対戦可能です！" : 
      "ジムリーダーは現在対戦できません。",
    walletAddress: data.wallet_address
  };
}

// @ts-ignore
Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    if (req.method === 'GET') {
      const url = new URL(req.url);
      const gymLeaderId = Number(url.searchParams.get('id')) || 1;  // デフォルトは1

      // ジムリーダーの状態を取得
      const status = await checkGymLeaderStatus(gymLeaderId);
      console.log('Gym Leader Status:', status);

      return new Response(JSON.stringify(status), {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      });
    }

    throw new Error('Method not allowed');

  } catch (error) {
    console.error('Error:', error);

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