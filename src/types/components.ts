import { UPDATE_TODO, ADD_TODO, REMOVE_TODO } from 'src/constants'

export interface Error {
  message: string
}

export interface ListItem {
  _id: number
  title: string
  completed: boolean
}

export interface TypeMutation {
  typeMutation: typeof ADD_TODO | typeof UPDATE_TODO | typeof REMOVE_TODO
}

export function isError(error: unknown): error is Error {
  return (error as Error).message !== undefined
}
