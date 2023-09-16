import dayjs from 'dayjs'

import { Slug } from './value-objects/slug'
import { Optional, UniqueEntityID, AggregateRoot } from '@/core'
import { QuestionAttachmentList } from './question-attachment-list'
import { QuestionBestAnswerChosenEvent } from '../events/question-best-answer-chosen-event'

export interface QuestionProps {
  slug: Slug
  title: string
  content: string
  attachments: QuestionAttachmentList
  bestAnswerId?: UniqueEntityID
  authorId: UniqueEntityID
  createdAt: Date
  updatedAt?: Date
}

export class Question extends AggregateRoot<QuestionProps> {
  get slug() {
    return this.props.slug
  }

  get title() {
    return this.props.title
  }

  set title(title: string) {
    this.props.title = title
    this.props.slug = Slug.createFromText(title)
    this.update()
  }

  get content() {
    return this.props.content
  }

  set content(content: string) {
    this.props.content = content
    this.update()
  }

  get attachments() {
    return this.props.attachments
  }

  set attachments(attachments: QuestionAttachmentList) {
    this.props.attachments = attachments
    this.update()
  }

  get bestAnswerId() {
    return this.props.bestAnswerId
  }

  set bestAnswerId(bestAnswerId: UniqueEntityID | undefined) {
    if (bestAnswerId && bestAnswerId !== this.props.bestAnswerId) {
      this.addDomainEvent(new QuestionBestAnswerChosenEvent(this, bestAnswerId))
    }

    this.props.bestAnswerId = bestAnswerId
    this.update()
  }

  get authorId() {
    return this.props.authorId
  }

  get createdAt() {
    return this.props.createdAt
  }

  get updatedAt() {
    return this.props.updatedAt
  }

  get isNew(): boolean {
    return dayjs().diff(this.createdAt, 'days') <= 3
  }

  get excerpt() {
    return this.content.substring(0, 120).trimEnd().concat('...')
  }

  get resume() {
    return `Nova resposta em "${this.props.title
      .substring(0, 40)
      .concat('...')}"`
  }

  private update() {
    this.props.updatedAt = new Date()
  }

  static create(
    props: Optional<QuestionProps, 'createdAt' | 'slug' | 'attachments'>,
    id?: UniqueEntityID,
  ) {
    const question = new Question(
      {
        ...props,
        slug: props.slug ?? Slug.createFromText(props.title),
        attachments: props.attachments ?? new QuestionAttachmentList(),
        createdAt: new Date(),
      },
      id,
    )
    return question
  }
}
