import { useState } from 'react'
import { analyzeReviews, loadAiSettings, saveAiSettings } from './ai.ts'
import type { Review } from './types.ts'

type Props = {
  reviews: Review[]
}

export default function AiAdvice({ reviews }: Props) {
  const [settings, setSettings] = useState(loadAiSettings)
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (next: Partial<typeof settings>) => {
    const updated = { ...settings, ...next }
    setSettings(updated)
    saveAiSettings(updated)
  }

  const handleAnalyze = async () => {
    setLoading(true)
    setError('')
    setResult('')
    try {
      const advice = await analyzeReviews(reviews, settings)
      setResult(advice)
    } catch (e) {
      setError(e instanceof Error ? e.message : '分析に失敗しました')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="space-y-6">
      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-slate-800">AI分析設定</h2>
        <p className="mb-4 text-sm text-slate-500">
          OpenAI 互換の API 情報を入力してください。APIキーはブラウザ内（localStorage）に保持され、リポジトリには含まれません。
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="flex flex-col gap-1 text-sm font-medium text-slate-700 sm:col-span-2">
            API ベースURL
            <input
              type="url"
              value={settings.baseUrl}
              onChange={(e) => handleChange({ baseUrl: e.target.value })}
              className="rounded-lg border border-slate-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </label>
          <label className="flex flex-col gap-1 text-sm font-medium text-slate-700">
            モデル
            <input
              type="text"
              value={settings.model}
              onChange={(e) => handleChange({ model: e.target.value })}
              className="rounded-lg border border-slate-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </label>
          <label className="flex flex-col gap-1 text-sm font-medium text-slate-700">
            APIキー
            <input
              type="password"
              value={settings.apiKey}
              onChange={(e) => handleChange({ apiKey: e.target.value })}
              className="rounded-lg border border-slate-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              placeholder="sk-..."
            />
          </label>
        </div>
      </div>

      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-slate-800">AI分析</h2>
        {reviews.length === 0 ? (
          <p className="text-slate-500">記録がないと分析できません。先に振り返りを入力してください。</p>
        ) : (
          <>
            <p className="mb-4 text-sm text-slate-500">
              {reviews.length} 件の記録をもとに、傾向とアドバイスを作成します。
            </p>
            <button
              type="button"
              onClick={handleAnalyze}
              disabled={loading}
              className="rounded-lg bg-indigo-600 px-5 py-2.5 text-white shadow-sm hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-slate-400"
            >
              {loading ? '分析中...' : '分析してアドバイスを得る'}
            </button>
          </>
        )}
        {error && (
          <p className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>
        )}
        {result && (
          <div className="mt-6">
            <h3 className="mb-2 text-sm font-semibold text-slate-700">分析結果</h3>
            <pre className="whitespace-pre-wrap rounded-lg bg-slate-50 p-4 text-sm leading-relaxed text-slate-800">
              {result}
            </pre>
          </div>
        )}
      </div>
    </section>
  )
}
