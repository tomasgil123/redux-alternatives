import React from 'react'
import { useUpdateTodo } from 'src/hooks'

//types
import { ListItem } from 'src/types/components'

interface Props {
  todoData: ListItem
}

const Item = ({ todoData }: Props): JSX.Element => {
  const { mutate } = useUpdateTodo()

  return (
    <div style={{ padding: '10px', margin: '10px', border: '1px solid black' }}>
      {todoData.title}
      <button
        onClick={(): void =>
          mutate(({
            id: 1,
            title: 'foo',
            completed: true,
            userId: 1,
          } as unknown) as void)
        }
      >
        Update todo
      </button>
    </div>
  )
}

export default Item
