export interface Error {
  message: string
}

export interface ListItem {
  userId: number
  id: number
  title: string
  completed: boolean
}

export function isError(error: unknown): error is Error {
  return (error as Error).message !== undefined
}
