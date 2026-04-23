import { AIResponse, ChatMessage } from '@/types'

const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions'

const SYSTEM_PROMPT = `You are ARIA — an expert AI Personal Shopping Assistant.

CRITICAL RULE: You MUST respond with a single valid JSON object ONLY. No prose, no markdown, no explanation outside the JSON. Every single response must be parseable JSON.

PERSONALITY: Warm, knowledgeable, concise. Like a brilliant friend who knows everything about products.

CONVERSATION FLOW:
1. Start by identifying what they want to buy
2. Ask 2-3 targeted follow-up questions ONE AT A TIME: budget, primary use case, key priorities
3. After gathering enough context, provide a structured recommendation

For questions/gathering info:
{"type":"question","message":"Your warm conversational message here","progress":10}

Progress scale: 10=started, 30=have category, 60=have budget+use case, 85=have priorities, 95=ready to recommend, 100=recommendation given

For final recommendation:
{"type":"recommendation","message":"Here's what I'd pick for you — and why it fits perfectly.","progress":100,"recommendation":{"primary":{"name":"Exact Product Name Model","price":"$XXX","tagline":"One line on why it's perfect for THIS user","pros":["specific pro 1","specific pro 2","specific pro 3"],"cons":["honest con 1","honest con 2"],"score":94,"whyThis":"Personalized 1-2 sentence explanation referencing their specific needs","regretRisk":"low","regretReason":"The one scenario where you might wish you chose differently"},"alternatives":[{"name":"Alternative Product Name","price":"$XXX","tagline":"Better if you prioritize X over Y","pros":["pro 1","pro 2"],"cons":["con 1"],"score":87,"whyConsider":"Pick this instead if budget is tighter or you need X feature"},{"name":"Premium Alternative Name","price":"$XXX","tagline":"Step up if you want the best","pros":["pro 1","pro 2"],"cons":["con 1"],"score":91,"whyConsider":"Worth it if you can stretch the budget for long-term value"}],"summary":"1-2 sentence personalized summary","hiddenCosts":["potential hidden cost 1 with dollar estimate","accessory or subscription needed"],"longTermValue":"Honest assessment of 2-3 year value and total cost of ownership"}}`

export async function getAIResponse(
  messages: { role: 'user' | 'assistant'; content: string }[]
): Promise<AIResponse> {
  const apiKey = process.env.OPENROUTER_API_KEY

  if (!apiKey || apiKey === 'sk-or-v1-your-key-here') {
    throw new Error('OPENROUTER_API_KEY is not configured')
  }

  let responseText = ''

  try {
    const res = await fetch(OPENROUTER_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000',
        'X-Title': 'ARIA Voice AI Shopper',
      },
      body: JSON.stringify({
        model: 'openai/gpt-4o-mini',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          ...messages,
        ],
        temperature: 0.7,
        max_tokens: 1500,
        response_format: { type: 'json_object' }, // forces gpt-4o-mini to always return valid JSON
      }),
    })

    responseText = await res.text()
    console.log('[OpenRouter] status:', res.status)

    if (!res.ok) {
      console.error('[OpenRouter] error body:', responseText)
      if (res.status === 401) throw new Error('Invalid API key — check OPENROUTER_API_KEY in .env.local')
      if (res.status === 402) throw new Error('OpenRouter credits exhausted — add credits at openrouter.ai')
      if (res.status === 429) throw new Error('Rate limit reached — please wait a moment')
      if (res.status === 404) throw new Error('Model not found on OpenRouter')
      let msg = 'AI service error'
      try { msg = JSON.parse(responseText)?.error?.message ?? msg } catch {}
      throw new Error(msg)
    }

    const data = JSON.parse(responseText)
    const raw: string = data.choices?.[0]?.message?.content ?? ''
    console.log('[OpenRouter] raw content:', raw.slice(0, 200))

    // Strip markdown code fences if the model wraps the JSON
    const jsonStr = raw
      .replace(/^```(?:json)?\s*/i, '')
      .replace(/\s*```$/, '')
      .trim()

    // Extract the first JSON object in case there's surrounding text
    const jsonMatch = jsonStr.match(/\{[\s\S]*\}/)
    const toParse = jsonMatch ? jsonMatch[0] : jsonStr

    try {
      const parsed = JSON.parse(toParse) as AIResponse
      if (!parsed.type) throw new Error('Missing type field')
      return parsed
    } catch (parseErr) {
      console.error('[AI] JSON parse failed:', parseErr, '— snippet:', toParse.slice(0, 300))
      // Never show raw JSON to the user — always return a safe fallback
      return {
        type: 'question',
        message: "I'm here to help you find the perfect product. What are you looking to buy today?",
        progress: 10,
      }
    }
  } catch (err) {
    console.error('[AI Service] exception:', err)
    throw err
  }
}

export function messagesToAPIFormat(
  chatMessages: ChatMessage[]
): { role: 'user' | 'assistant'; content: string }[] {
  return chatMessages
    .filter((m) => m.type !== 'thinking')
    .map((m) => ({
      role: m.role,
      content: m.role === 'assistant' && m.recommendation
        ? `I recommended: ${m.content}`
        : m.content,
    }))
}
