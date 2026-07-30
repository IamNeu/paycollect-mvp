const axios = require('axios')

const ANTHROPIC_API_URL = 'https://api.anthropic.com/v1/messages'
    // Haiku is plenty for structured summarization and keeps nightly batch costs low.
    // Bump to 'claude-sonnet-4-6' if you want deeper pattern-spotting later.
const MODEL = 'claude-haiku-4-5-20251001'

async function generateDashboardInsights(summaryData) {
    const prompt = `You are a financial analyst assistant for a small business payment collection platform called PayCollect.

Below is a JSON summary of the merchant's current payment data (aging buckets, customer payment behavior, channel mix). Surface 2-4 of the MOST IMPORTANT insights — anomalies, risks, or opportunities a busy merchant might miss. Don't just restate numbers; say what they mean and what to do.

Data:
${JSON.stringify(summaryData, null, 2)}

Respond with ONLY a JSON array (no markdown fences, no preamble) in this exact shape:
[
  {
    "type": "warning" | "info" | "success" | "opportunity",
    "icon": "<single emoji>",
    "text": "<one or two sentence insight, specific to the numbers above>",
    "action": { "label": "<short button label>", "route": "<one of: /customers, /reports, /requests, /requests/new>" } or null
  }
]`

    const response = await axios.post(
        ANTHROPIC_API_URL, {
            model: MODEL,
            max_tokens: 800,
            messages: [{ role: 'user', content: prompt }]
        }, {
            headers: {
                'x-api-key': process.env.ANTHROPIC_API_KEY,
                'anthropic-version': '2023-06-01',
                'content-type': 'application/json'
            }
        }
    )

    const textBlock = response.data.content.find(b => b.type === 'text')
    if (!textBlock) throw new Error('No text response from Claude')

    const cleaned = textBlock.text.replace(/```json|```/g, '').trim()
    return JSON.parse(cleaned)
}

module.exports = { generateDashboardInsights }