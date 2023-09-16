import { it, describe, expect } from 'vitest'
import { Slug } from './slug'

type SutTypes = { sut: Slug }

const makeSut = (text: string): SutTypes => {
  const sut = Slug.createFromText(text)
  return { sut }
}

describe('Slug', () => {
  it('should be able to create a new slug from text "Example question title"', async () => {
    const { sut } = makeSut('Example question title')
    expect(sut.value).toEqual('example-question-title')
  })

  it('should be able to create a new slug from text "_Example-- q u e s t i o n title- "', async () => {
    const { sut } = makeSut('Example question title')
    expect(sut.value).toEqual('example-question-title')
  })
})
