import React from 'react'
import { useGetTodos, useMutationTodo } from 'src/hooks'

const objectId = (m = Math, d = Date, h = 16, s = (s): any => m.floor(s).toString(h)): any =>
  s(d.now() / 1000) + ' '.repeat(h).replace(/./g, () => s(m.random() * h))

//components
import Todo from './todo'

//constants
import { ADD_TODO } from 'src/constants'

//TODO: think about hot to show feedback to the user if the mutation fails

const Parent = (): JSX.Element => {
  //esto se esta ejecutando despues del que esta en el layout. Porque?
  const { isLoading, error, data } = useGetTodos()

  const { mutate, error: errorGetTodos } = useMutationTodo({ typeMutation: ADD_TODO })

  const onAddNewTodo = (): void => {
    const _id = objectId()
    const newTodo = {
      _id: _id,
      title: `new todo ${_id}`,
      completed: false,
    }
    mutate((newTodo as unknown) as void)
  }

  if (isLoading) return <div>Loading items...</div>

  if (error) return <div>{`An error has occurred: ${error.message}`}</div>

  return (
    <div>
      <div>List of items</div>
      <div>
        <button onClick={onAddNewTodo}>Add new todo</button>
      </div>
      {errorGetTodos && <div>An error occurred when trying to add a new todo</div>}
      {data.slice(0, 10).map((todo) => (
        <Todo key={todo._id} todoData={todo} />
      ))}
    </div>
  )
}

export default Parent
