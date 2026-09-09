import type { Review } from './types.ts'

export type AiSettings = {
  baseUrl: string
  model: string
  apiKey: string
}

const SETTINGS_KEY = 'review_app_ai_settings'

export function loadAiSettings(): AiSettings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY)
    if (!raw) return { baseUrl: 'https://api.openai.com/v1', model: 'gpt-4o-mini', apiKey: '' }
    return JSON.parse(raw) as AiSettings
  } catch {
    return { baseUrl: 'https://api.openai.com/v1', model: 'gpt-4o-mini', apiKey: '' }
  }
}

export function saveAiSettings(settings: AiSettings): void {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings))
}

export async function analyzeReviews(reviews: Review[], settings: AiSettings): Promise<string> {
  if (!settings.apiKey) throw new Error('APIキーが設定されていません')

  const summaries = reviews
    .slice()
    .sort((a, b) => a.date.localeCompare(b.date))
    .map((r) => {
      const answers = Object.entries(r.answers)
        .map(([k, v]) => `${k}: ${v}`)
        .join('\n')
      return `日付: ${r.date}\n形式: ${r.type}\n${answers}`
    })
    .join('\n\n---\n\n')

  const messages = [
    {
      role: 'system',
      content:
        'あなたは振り返りの分析アシスタントです。蓄積された振り返りをもとに、前向きなフィードバックと次に取り組むべきアドバイスを簡潔に日本語で提供してください。',
    },
    {
      role: 'user',
      content: `以下はユーザーの振り返り記録です。\n\n${summaries}\n\n以上をもとに、良かった傾向、気になる傾向、次に試すことを含めたアドバイスを書いてください。`,
    },
  ]

  const res = await fetch(`${settings.baseUrl.replace(/\/$/, '')}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${settings.apiKey}`,
    },
    body: JSON.stringify({
      model: settings.model,
      messages,
      temperature: 0.7,
    }),
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`APIエラー: ${res.status} ${text}`)
  }

  const json = (await res.json()) as {
    choices: { message: { content: string } }[]
  }
  return json.choices?.[0]?.message?.content ?? '分析結果がありません'
}
