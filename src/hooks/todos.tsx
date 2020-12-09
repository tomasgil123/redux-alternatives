import { useMutation, useQuery, useQueryCache } from 'react-query'
import { ADD_TODO, REMOVE_TODO, UPDATE_TODO } from 'src/constants'
import { mutations, getTodos } from 'src/service'

//types
import { ListItem, TypeMutation } from 'src/types/components'

interface ResultMutationTodo {
  mutate: (listItem: ListItem) => void
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

//PROBLEM: useMutation does not return errors. We dont have a way to know if something fails and give feedback to the user
// onSettle does not return anything
// https://github.com/tannerlinsley/react-query/issues/121

export const useMutationTodo = ({ typeMutation }: TypeMutation): ResultMutationTodo => {
  const cache = useQueryCache()

  //error, isError, isLoading dont return anything. We will have to handle those status ourselves
  const [mutate, { error, isError, isLoading }] = useMutation<unknown>(mutations[typeMutation], {
    // When mutate is called:
    onMutate: (newTodo) => {
      // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
      cache.cancelQueries('todos')

      // Optimistically update to the new value
      cache.setQueryData('todos', (old: ListItem[]) => {
        if (typeMutation === UPDATE_TODO) {
          return updateTodo({ todos: old, newTodo })
        }
        if (typeMutation === ADD_TODO) {
          return addTodo({ todos: old, newTodo })
        }
        if (typeMutation === REMOVE_TODO) {
          return removeTodo({ todos: old, newTodo })
        }
      })
      return cache.getQueryData('todos')
    },
    // If the mutation fails (not confuse with the request), use the value returned from onMutate to roll back
    onError: (err, variables, previousValue) => {
      const todos = cache.getQueryData('todos')
      cache.setQueryData('todos', previousValue)
      return todos as any
    },
    // Always refetch after error or success:
    onSettled: (data, error, newTodo, previousValue) => {
      // Como sabemos que tipo de request es? Por typeMutation. A su vez, podemos obtener el body de la variable newTodo

      // - previousValue parece que dejo de venir. Parece que no viene cuando no hay un error, si hay un error si viene

      if ((error as any).message) {
        if (!((error as any).message === 'Failed to fetch')) {
          cache.setQueryData('todos', () => previousValue)
        }

        //if request failed to fetch, we save the results in the indexedDB
        //we also need to save the request
      }
    },
  })

  return { mutate, error }
}

interface ResultGetTodos {
  data: ListItem[]
  isLoading: boolean
  error: any
}

export const useGetTodos = (): ResultGetTodos => {
  const { isLoading, error, data } = useQuery('todos', () => getTodos().then((res) => res.json()), {
    refetchOnMount: false,
  })
  return { isLoading, error, data }
}
