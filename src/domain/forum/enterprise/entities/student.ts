import { Entity, UniqueEntityID } from '@/core'

interface StudentProps {
  name: string
}

export class Student extends Entity<StudentProps> {
  static create(props: StudentProps, id?: UniqueEntityID) {
    const student = new Student(props, id)
    return student
  }
}
