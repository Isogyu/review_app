export type ReviewType = 'KPT' | 'YWT'

export type Review = {
  id: string
  date: string // YYYY-MM-DD
  type: ReviewType
  answers: Record<string, string>
  createdAt: number
  updatedAt: number
}

export const REVIEW_TYPES: ReviewType[] = ['KPT', 'YWT']

export const REVIEW_QUESTIONS: Record<ReviewType, { key: string; label: string }[]> = {
  KPT: [
    { key: 'keep', label: '今日、うまくいったことは何ですか？' },
    { key: 'problem', label: '今日、うまくいかなかったこと・問題は何ですか？' },
    { key: 'try', label: '次に試したいことは何ですか？' },
  ],
  YWT: [
    { key: 'did', label: '今日やったことは何ですか？' },
    { key: 'learned', label: '今日わかったことは何ですか？' },
    { key: 'will', label: '次にやることは何ですか？' },
  ],
}
