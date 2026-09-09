import { eachWeekOfInterval, endOfWeek, format, isSameWeek, startOfDay, startOfWeek, subDays } from 'date-fns'
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { type Review } from './types.ts'

type Props = {
  reviews: Review[]
}

function getWeeklyCounts(reviews: Review[]) {
  const today = new Date()
  const start = startOfWeek(subDays(today, 56), { weekStartsOn: 1 })
  const end = endOfWeek(today, { weekStartsOn: 1 })
  const weeks = eachWeekOfInterval({ start, end }, { weekStartsOn: 1 })

  return weeks.map((weekStart) => {
    const count = reviews.filter((r) =>
      isSameWeek(new Date(r.date), weekStart, { weekStartsOn: 1 })
    ).length
    return {
      label: format(weekStart, 'MM/dd'),
      count,
    }
  })
}

function getLast35Days(reviews: Review[]) {
  const today = startOfDay(new Date())
  const days: { date: Date; label: string; count: number }[] = []
  for (let i = 34; i >= 0; i--) {
    const d = subDays(today, i)
    const ymd = format(d, 'yyyy-MM-dd')
    const count = reviews.filter((r) => r.date === ymd).length
    days.push({ date: d, label: format(d, 'd'), count })
  }
  return days
}

function heatColor(count: number) {
  if (count === 0) return 'bg-slate-100'
  if (count === 1) return 'bg-emerald-200'
  if (count === 2) return 'bg-emerald-400'
  return 'bg-emerald-600'
}

export default function Stats({ reviews }: Props) {
  const weekly = getWeeklyCounts(reviews)
  const days = getLast35Days(reviews)
  const total = reviews.length
  const streak = useStreak(reviews)

  return (
    <section className="space-y-8">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl bg-white p-4 shadow-sm">
          <p className="text-xs text-slate-500">記録数</p>
          <p className="text-2xl font-semibold text-slate-800">{total}</p>
        </div>
        <div className="rounded-2xl bg-white p-4 shadow-sm">
          <p className="text-xs text-slate-500">連続日数</p>
          <p className="text-2xl font-semibold text-slate-800">{streak}</p>
        </div>
        <div className="rounded-2xl bg-white p-4 shadow-sm">
          <p className="text-xs text-slate-500">平均/週</p>
          <p className="text-2xl font-semibold text-slate-800">
            {(weekly.reduce((s, w) => s + w.count, 0) / weekly.length).toFixed(1)}
          </p>
        </div>
      </div>

      <div className="rounded-2xl bg-white p-4 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-slate-800">週次記録数</h2>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={weekly}>
              <XAxis dataKey="label" tick={{ fontSize: 12 }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="count" fill="#4f46e5" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="rounded-2xl bg-white p-4 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-slate-800">直近35日の記録</h2>
        <div className="grid grid-cols-7 gap-1">
          {days.map((d) => (
            <div
              key={d.date.toISOString()}
              title={`${format(d.date, 'yyyy-MM-dd')}: ${d.count}件`}
              className={`aspect-square rounded-sm ${heatColor(d.count)}`}
            />
          ))}
        </div>
        <div className="mt-2 flex items-center gap-4 text-xs text-slate-500">
          <span>少</span>
          <span className="h-3 w-3 rounded-sm bg-slate-100" />
          <span className="h-3 w-3 rounded-sm bg-emerald-200" />
          <span className="h-3 w-3 rounded-sm bg-emerald-400" />
          <span className="h-3 w-3 rounded-sm bg-emerald-600" />
          <span>多</span>
        </div>
      </div>
    </section>
  )
}

function useStreak(reviews: Review[]) {
  const dates = new Set(reviews.map((r) => r.date))
  let streak = 0
  let d = startOfDay(new Date())
  while (dates.has(format(d, 'yyyy-MM-dd'))) {
    streak++
    d = subDays(d, 1)
  }
  return streak
}
