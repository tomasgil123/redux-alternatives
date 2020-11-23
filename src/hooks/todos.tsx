import {
  useMutation,
  useQuery,
  useQueryClient,
  MutationFunction,
  UseMutateFunction,
} from 'react-query'
import { ADD_TODO, REMOVE_TODO, UPDATE_TODO } from 'src/constants'
import { mutations, getTodos } from 'src/service'

//types
import { ListItem, TypeMutation } from 'src/types/components'

interface ResultMutationTodo {
  mutate: UseMutateFunction
  error: any
}

interface TodoMutation {
  todos: ListItem[]
  newTodo: any
}

const updateTodo = ({ todos, newTodo }: TodoMutation): any => {
  return todos.map((todo) => {
    return todo._id === newTodo._id ? newTodo : todo
  })
}

const removeTodo = ({ todos, newTodo }: TodoMutation): any => {
  return todos.filter((todo) => todo._id !== newTodo)
}

const addTodo = ({ todos, newTodo }: TodoMutation): any => {
  return [...todos, newTodo]
}

//PROBLEM: useMutation does not return errors. We dont have a way to know something fails when it does
// onSettle does not return anything

export const useMutationTodo = ({ typeMutation }: TypeMutation): ResultMutationTodo => {
  const cache = useQueryClient()
  const { mutate, error } = useMutation<unknown>(mutations[typeMutation] as MutationFunction, {
    // When mutate is called:
    onMutate: (newTodo) => {
      // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
      cache.cancelQueries('todos')

      // Snapshot the previous value
      const previousTodos = cache.getQueryData('todos')

      // Optimistically update to the new value
      cache.setQueryData('todos', (old: ListItem[]) => {
        if (typeMutation === UPDATE_TODO) {
          return updateTodo({ todos: old, newTodo })
        }
        if (typeMutation === ADD_TODO) {
          console.log('newTodo add todo', newTodo)
          return addTodo({ todos: old, newTodo })
        }
        if (typeMutation === REMOVE_TODO) {
          console.log('newTodo remove todo', newTodo)
          return removeTodo({ todos: old, newTodo })
        }
      })
      return previousTodos
    },
    // If the mutation fails (not confuse with the request), use the value returned from onMutate to roll back
    onError: (err, variables, previousValue) => {
      return cache.setQueryData('todos', previousValue) as any
    },
    // Always refetch after error or success:
    onSettled: (data, error, newTodo, previousValue) => {
      //previousValue is the list of todos before the change
      //by modifying the cahce again we avoid some buggy situations when going back online from an offline context
      if (!error) {
        cache.setQueryData('todos', () => {
          if (typeMutation === UPDATE_TODO) {
            return updateTodo({ todos: previousValue as ListItem[], newTodo })
          }
          if (typeMutation === ADD_TODO) {
            console.log('newTodo add todo', newTodo)
            return addTodo({ todos: previousValue as ListItem[], newTodo })
          }
          if (typeMutation === REMOVE_TODO) {
            console.log('newTodo remove todo', newTodo)
            return removeTodo({ todos: previousValue as ListItem[], newTodo })
          }
        })
      } else {
        cache.setQueryData('todos', () => previousValue)
      }
    },
    retry: 1,
  })

  return { mutate, error }
}

interface ResultGetTodos {
  data: ListItem[]
  isLoading: boolean
  error: any
}

export const useGetTodos = (): ResultGetTodos => {
  const { isLoading, error, data } = useQuery('todos', () => getTodos().then((res) => res.json()))
  return { isLoading, error, data }
}
