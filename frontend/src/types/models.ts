/**
 * Model Category
 *
 */
export type Category = {
  id: number
  name: string
  description: string
  durationDays: number
  optional: boolean
  filters?: Filter[]
}

/**
 * Model Filter
 *
 */
export type Filter = {
  id: number
  isActive: boolean
  expirationDate: Date
  createdAt: Date
  updatedAt: Date
  categoryId: number
  category?: Category
}