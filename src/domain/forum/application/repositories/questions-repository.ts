import { PaginationParams } from '@/core/repositories/pagination-params'
import { Question } from '@/domain/forum/enterprise/entities'

export interface QuestionsRepository {
  findById(id: string): Promise<Question | null>
  findBySlug(slug: string): Promise<Question | null>
  findManyRecent(params: PaginationParams): Promise<Array<Question>>
  create(answer: Question): Promise<void>
  delete(question: Question): Promise<void>
  save(question: Question): Promise<void>
}
