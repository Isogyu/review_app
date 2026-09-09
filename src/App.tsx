import { Pencil, Trash2 } from 'lucide-react'
import { useRef, useState } from 'react'
import AiAdvice from './AiAdvice.tsx'
import ReviewForm from './ReviewForm.tsx'
import Stats from './Stats.tsx'
import { deleteReview, exportToJson, importFromJson, loadReviews, saveReviews } from './storage.ts'
import { REVIEW_QUESTIONS, type Review } from './types.ts'

type Tab = 'input' | 'history' | 'stats' | 'ai'

function formatDate(date: string) {
  return date.replace(/-/g, '/')
}

function App() {
  const [tab, setTab] = useState<Tab>('input')
  const [reviews, setReviews] = useState<Review[]>(() => loadReviews())
  const [editing, setEditing] = useState<Review | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const refresh = () => {
    setReviews(loadReviews())
  }

  const handleDelete = (id: string) => {
    deleteReview(id)
    refresh()
  }

  const handleClear = () => {
    if (confirm('すべての履歴を削除します。よろしいですか？')) {
      saveReviews([])
      refresh()
    }
  }

  const handleEdit = (review: Review) => {
    setEditing(review)
    setTab('input')
  }

  const handleCancelEdit = () => {
    setEditing(null)
  }

  const handleSaved = () => {
    refresh()
    if (editing) {
      setEditing(null)
    }
  }

  const handleExport = () => {
    const blob = new Blob([exportToJson()], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `review_app_backup_${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    try {
      const text = await file.text()
      importFromJson(text)
      refresh()
    } catch (err) {
      alert('インポートに失敗しました: ' + (err instanceof Error ? err.message : String(err)))
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const tabs: { key: Tab; label: string }[] = [
    { key: 'input', label: '入力' },
    { key: 'history', label: '履歴' },
    { key: 'stats', label: '統計' },
    { key: 'ai', label: 'AI分析' },
  ]

  return (
    <div className="mx-auto max-w-3xl px-4 py-6">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold text-slate-800">振り返りアプリ</h1>
        <p className="text-slate-500">KPT / YWT で毎日を振り返る</p>
      </header>

      <nav className="mb-6 flex gap-2 border-b border-slate-200">
        {tabs.map(({ key, label }) => (
          <button
            key={key}
            type="button"
            onClick={() => {
              setTab(key)
              if (key === 'input' && !editing) {
                setEditing(null)
              }
            }}
            className={`border-b-2 px-4 py-2 text-sm font-medium ${
              tab === key
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            {label}
          </button>
        ))}
      </nav>

      {tab === 'input' && (
        <ReviewForm
          key={editing?.id ?? 'new'}
          onSaved={handleSaved}
          editing={editing}
          onCancelEdit={handleCancelEdit}
        />
      )}

      {tab === 'history' && (
        <section className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-lg font-semibold text-slate-800">履歴</h2>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={handleExport}
                className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50"
              >
                エクスポート
              </button>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50"
              >
                インポート
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="application/json"
                onChange={handleImport}
                className="hidden"
              />
              <button
                type="button"
                onClick={handleClear}
                className="rounded-lg border border-red-200 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50"
              >
                すべて削除
              </button>
            </div>
          </div>
          {reviews.length === 0 ? (
            <p className="text-slate-500">まだ記録がありません。</p>
          ) : (
            <ul className="space-y-4">
              {reviews
                .slice()
                .sort((a, b) => b.date.localeCompare(a.date) || b.createdAt - a.createdAt)
                .map((review) => (
                  <li
                    key={review.id}
                    className="rounded-2xl border border-slate-200 bg-white p-4"
                  >
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-sm font-semibold text-slate-700">
                        {formatDate(review.date)} / {review.type}
                      </span>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => handleEdit(review)}
                          className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-sm text-indigo-600 hover:bg-indigo-50"
                          aria-label="編集"
                        >
                          <Pencil size={16} />
                          <span className="hidden sm:inline">編集</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(review.id)}
                          className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-sm text-red-600 hover:bg-red-50"
                          aria-label="削除"
                        >
                          <Trash2 size={16} />
                          <span className="hidden sm:inline">削除</span>
                        </button>
                      </div>
                    </div>
                    <dl className="space-y-2">
                      {REVIEW_QUESTIONS[review.type].map((q) => (
                        review.answers[q.key] && (
                          <div key={q.key}>
                            <dt className="text-xs font-medium text-slate-500">
                              {q.label}
                            </dt>
                            <dd className="whitespace-pre-wrap text-sm text-slate-800">
                              {review.answers[q.key]}
                            </dd>
                          </div>
                        )
                      ))}
                    </dl>
                  </li>
                ))}
            </ul>
          )}
        </section>
      )}

      {tab === 'stats' && <Stats reviews={reviews} />}
      {tab === 'ai' && <AiAdvice reviews={reviews} />}
    </div>
  )
}

export default App
