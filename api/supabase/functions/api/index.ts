// @ts-ignore
Deno.serve(async (req) => {
// @ts-ignore
  const apiKey = Deno.env.get('TEST_SECRET')
  
  return new Response(JSON.stringify({
    message: "Hello from Supabase!",
    key: apiKey
  }), {
    headers: { "Content-Type": "application/json" },
  })
})