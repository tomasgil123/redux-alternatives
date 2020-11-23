import React from 'react'
import { useUpdateTodo, useGetTodos } from 'src/hooks'

//components
import Todo from './todo'

const Parent = (): JSX.Element => {
  //esto se esta ejecutando despues del que esta en el layout. Porque?
  const { isLoading, error, data } = useGetTodos()
  const { isError } = useUpdateTodo()

  if (isLoading) return <div>Loading items...</div>

  if (error) return <div>{`An error has occurred: ${error.message}`}</div>

  return (
    <div>
      <div>List of items</div>
      {isError && <div>An error has occurred while updating the todos</div>}
      {data.slice(0, 10).map((todo) => (
        <Todo key={todo.id} todoData={todo} />
      ))}
    </div>
  )
}

export default Parent
