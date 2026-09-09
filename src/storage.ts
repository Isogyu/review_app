import type { Review } from './types.ts'

const STORAGE_KEY = 'review_app_reviews'

export function loadReviews(): Review[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as unknown
    if (!Array.isArray(parsed)) return []
    return parsed as Review[]
  } catch {
    return []
  }
}

export function saveReviews(reviews: Review[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(reviews))
}

export function saveReview(review: Review): void {
  const reviews = loadReviews()
  const index = reviews.findIndex((r) => r.id === review.id)
  if (index >= 0) {
    reviews[index] = review
  } else {
    reviews.push(review)
  }
  saveReviews(reviews)
}

export function deleteReview(id: string): void {
  const reviews = loadReviews().filter((r) => r.id !== id)
  saveReviews(reviews)
}

export function exportToJson(): string {
  return JSON.stringify(loadReviews(), null, 2)
}

export function importFromJson(json: string): Review[] {
  const parsed = JSON.parse(json) as unknown
  if (!Array.isArray(parsed)) throw new Error('JSONが配列ではありません')
  const reviews = parsed as Review[]
  saveReviews(reviews)
  return reviews
}
