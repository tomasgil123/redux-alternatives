import {
  useMutation,
  useQuery,
  useQueryClient,
  MutationFunction,
  UseMutateFunction,
} from 'react-query'
import { updateTodo } from 'src/service'

//types
import { ListItem, Error } from 'src/types/components'

interface ResultUpdateTodo {
  mutate: UseMutateFunction
  isError: boolean
}

export const useUpdateTodo = (): ResultUpdateTodo => {
  const cache = useQueryClient()
  const { mutate, isError } = useMutation<unknown>(updateTodo as MutationFunction, {
    // When mutate is called:
    onMutate: (newTodo) => {
      // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
      cache.cancelQueries('todos')

      // Snapshot the previous value
      const previousTodos = cache.getQueryData('todos')

      // Optimistically update to the new value
      cache.setQueryData('todos', (old: ListItem[]) => {
        debugger
        return [...old, newTodo]
      })

      // Return the snapshotted value
      return (): unknown => cache.setQueryData('todos', previousTodos)
    },
    // If the mutation fails, use the value returned from onMutate to roll back
    onError: (err, previousTodos) => {
      console.log('err', err)
      debugger
      return cache.setQueryData('todos', previousTodos)
    },
    // Always refetch after error or success:
    onSettled: () => {
      //in this case we want do anything
      console.log('on settled')
    },
    retry: 3,
  })

  return { mutate, isError }
}

interface ResultGetTodos {
  data: ListItem[]
  isLoading: boolean
  error: Error
}

export const useGetTodos = (): ResultGetTodos => {
  const { isLoading, error, data } = useQuery<ListItem[], Error>('todos', () =>
    fetch('https://jsonplaceholder.typicode.com/todos').then((res) => res.json())
  )
  return { isLoading, error, data }
}
