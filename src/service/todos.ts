//types
import { ListItem } from 'src/types/components'

export const updateTodo = async (listItem: ListItem): Promise<ListItem> => {
  const response = await fetch('https://jsonplaceholder.typicode.com/posts/1', {
    method: 'PUT',
    body: JSON.stringify(listItem),
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
    },
  })
  const todo = await response.json()
  return todo
}
