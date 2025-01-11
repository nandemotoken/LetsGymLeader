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
  isAvailable: boolean;
  battleMessage: string;
  imageUrl: string;
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

// setGymLeaderStatus関数を追加
async function setGymLeaderStatus(gymLeaderId: number, isAvailable: boolean, battleMessage: string, imageUrl: string): Promise<GymLeaderStatus> {
  const i = gymLeaderId;

  console.log(gymLeaderId, isAvailable, battleMessage, imageUrl);

  //@ts-ignore
  const webhookUrl = Deno.env.get(`DISCORD_ANNOUNCE_URL_GYM${i}`);

  // Discord通知の送信
  if (webhookUrl) {

    const systemMessage = isAvailable
      ? `🟢 ジムリーダー${i}が対戦可能になりました！`
      : `🔴 ジムリーダー${i}が対戦不可になりました。`;

    try {
      await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: systemMessage,
        }),
      });
    } catch (error) {
      console.error('Discord通知の送信に失敗しました:', error);
    }

    //1行で1秒待つ
    await new Promise(resolve => setTimeout(resolve, 1000));

    //画像を送信(あれば)
    if (imageUrl && imageUrl.startsWith('https://')) {
      try {
        await fetch(webhookUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            content: imageUrl,
          }),
        });
      } catch (error) {
        console.error('Discord通知の送信に失敗しました:', error);
      }
    }

    //1行で2秒待つ
    await new Promise(resolve => setTimeout(resolve, 2000));


    if (battleMessage) {

      try {
        await fetch(webhookUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            content: battleMessage,
          }),
        });
      } catch (error) {
        console.error('Discord通知の送信に失敗しました:', error);
      }
    }


  }

  const { data, error } = await supabaseClient
    .from('gym_leaders')
    .update({ is_available: isAvailable })
    .eq('id', gymLeaderId)
    .select()
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
    } else if (req.method === 'POST') {
      const body: RequestBody = await req.json();
      const gymLeaderId = body.gymLeaderId || 1;
      const battleMessage = body.battleMessage || '';
      const imageUrl = body.imageUrl || '';

      if (typeof body.isAvailable !== 'boolean') {
        throw new Error('isAvailable must be a boolean value');
      }

      const status = await setGymLeaderStatus(gymLeaderId, body.isAvailable, battleMessage, imageUrl);

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