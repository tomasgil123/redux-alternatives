import React from 'react'
import { useMutationTodo } from 'src/hooks'

//types
import { ListItem } from 'src/types/components'

//constants
import { UPDATE_TODO, REMOVE_TODO } from 'src/constants'

interface Props {
  todoData: ListItem
}

const Item = ({ todoData }: Props): JSX.Element => {
  const { mutate: updateTodo } = useMutationTodo({ typeMutation: UPDATE_TODO })
  const { mutate: removeTodo, error: errorRemove } = useMutationTodo({
    typeMutation: REMOVE_TODO,
  })
  console.log('isErrorRemove', errorRemove)
  return (
    <div style={{ padding: '10px', margin: '10px', border: '1px solid black' }}>
      <div style={todoData.completed ? { textDecoration: ' line-through' } : {}}>
        {todoData.title}
      </div>
      <div>
        <button
          onClick={(): void =>
            updateTodo({
              _id: todoData._id,
              title: todoData.title,
              completed: !todoData.completed,
            } as any)
          }
        >
          Toggle todo status
        </button>
      </div>
      <div>
        <button onClick={(): void => removeTodo(todoData._id as any)}>Remove todo</button>
      </div>
    </div>
  )
}

export default Item
