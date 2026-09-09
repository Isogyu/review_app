import { format } from 'date-fns'
import { useMemo, useState } from 'react'
import { REVIEW_QUESTIONS, REVIEW_TYPES, type Review, type ReviewType } from './types.ts'

function generateId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

type Props = {
  onSaved: () => void
}

export default function ReviewForm({ onSaved }: Props) {
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'))
  const [type, setType] = useState<ReviewType>('KPT')
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [saved, setSaved] = useState(false)

  const questions = useMemo(() => REVIEW_QUESTIONS[type], [type])

  const handleTypeChange = (next: ReviewType) => {
    setType(next)
    setAnswers({})
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const review: Review = {
      id: generateId(),
      date,
      type,
      answers,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    }
    const reviews = JSON.parse(localStorage.getItem('review_app_reviews') ?? '[]') as Review[]
    reviews.push(review)
    localStorage.setItem('review_app_reviews', JSON.stringify(reviews))
    setAnswers({})
    setSaved(true)
    setTimeout(() => setSaved(false), 1500)
    onSaved()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 rounded-2xl bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
        <label className="flex flex-1 flex-col gap-1 text-sm font-medium text-slate-700">
          日付
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="rounded-lg border border-slate-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </label>
        <label className="flex flex-1 flex-col gap-1 text-sm font-medium text-slate-700">
          振り返り形式
          <select
            value={type}
            onChange={(e) => handleTypeChange(e.target.value as ReviewType)}
            className="rounded-lg border border-slate-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            {REVIEW_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </label>
      </div>

      {questions.map((q) => (
        <label key={q.key} className="flex flex-col gap-2 text-sm font-medium text-slate-700">
          {q.label}
          <textarea
            value={answers[q.key] ?? ''}
            onChange={(e) =>
              setAnswers((prev) => ({ ...prev, [q.key]: e.target.value }))
            }
            className="min-h-[6rem] w-full rounded-lg border border-slate-300 px-3 py-2 leading-relaxed focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            placeholder="入力してください"
          />
        </label>
      ))}

      <div className="flex items-center gap-4">
        <button
          type="submit"
          className="rounded-lg bg-indigo-600 px-5 py-2.5 text-white shadow-sm hover:bg-indigo-700"
        >
          保存する
        </button>
        {saved && <span className="text-sm text-emerald-600">保存しました</span>}
      </div>
    </form>
  )
}
