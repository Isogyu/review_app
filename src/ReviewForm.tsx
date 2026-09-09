import { format } from 'date-fns'
import { useMemo, useState } from 'react'
import { saveReview } from './storage.ts'
import { REVIEW_QUESTIONS, REVIEW_TYPES, type Review, type ReviewType } from './types.ts'

function generateId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

type Props = {
  onSaved: () => void
  editing?: Review | null
  onCancelEdit?: () => void
}

export default function ReviewForm({ onSaved, editing, onCancelEdit }: Props) {
  const [date, setDate] = useState(editing?.date ?? format(new Date(), 'yyyy-MM-dd'))
  const [type, setType] = useState<ReviewType>(editing?.type ?? 'KPT')
  const [answers, setAnswers] = useState<Record<string, string>>(editing?.answers ?? {})
  const [saved, setSaved] = useState(false)

  const questions = useMemo(() => REVIEW_QUESTIONS[type], [type])

  const handleTypeChange = (next: ReviewType) => {
    setType(next)
    setAnswers({})
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const review: Review = {
      id: editing ? editing.id : generateId(),
      date,
      type,
      answers,
      createdAt: editing ? editing.createdAt : Date.now(),
      updatedAt: Date.now(),
    }
    saveReview(review)
    setAnswers({})
    setSaved(true)
    setTimeout(() => setSaved(false), 1500)
    onSaved()
    onCancelEdit?.()
  }

  const isEditing = Boolean(editing)

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
            disabled={isEditing}
            onChange={(e) => handleTypeChange(e.target.value as ReviewType)}
            className="rounded-lg border border-slate-300 px-3 py-2 disabled:cursor-not-allowed disabled:bg-slate-100 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
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
          {isEditing ? '更新する' : '保存する'}
        </button>
        {isEditing && onCancelEdit && (
          <button
            type="button"
            onClick={onCancelEdit}
            className="rounded-lg border border-slate-300 px-5 py-2.5 text-slate-700 hover:bg-slate-50"
          >
            キャンセル
          </button>
        )}
        {saved && <span className="text-sm text-emerald-600">保存しました</span>}
      </div>
    </form>
  )
}
