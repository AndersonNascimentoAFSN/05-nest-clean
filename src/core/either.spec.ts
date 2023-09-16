import { Either, Left, Right, left, right } from './either'

function doSomething(shouldSuccess: boolean): Either<string, string> {
  if (shouldSuccess) {
    return right('success')
  } else {
    return left('error')
  }
}

describe('Either', () => {
  it('success result', () => {
    const successResult = doSomething(true)

    expect(successResult.value).toEqual('success')
    expect(successResult).toBeInstanceOf(Right)
    expect(successResult.isRight()).toBe(true)
    expect(successResult.isLeft()).toBe(false)
  })

  it('error reason', () => {
    const errorReason = doSomething(false)

    expect(errorReason.value).toEqual('error')
    expect(errorReason).toBeInstanceOf(Left)
    expect(errorReason.isLeft()).toBe(true)
    expect(errorReason.isRight()).toBe(false)
  })
})
