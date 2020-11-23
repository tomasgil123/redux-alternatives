//types
import { ListItem } from 'src/types/components'

//contants
import { UPDATE_TODO, ADD_TODO, REMOVE_TODO } from 'src/constants'

interface UpdateTodo {
  _id: string
  completed: boolean
}

export const mutations = {
  [UPDATE_TODO]: async ({ _id, completed }: UpdateTodo): Promise<void> => {
    const response = await fetch('/api/updateTodo', {
      method: 'POST',
      body: JSON.stringify({ _id: _id, completed: completed }),
    })
    if (response.status !== 200 && response.status !== 201) {
      throw 'Error'
    }
    const body = await response.json()
    return body
  },
  [ADD_TODO]: async ({ _id, title, completed }: ListItem): Promise<void> => {
    const response = await fetch('/api/addTodo', {
      method: 'POST',
      body: JSON.stringify({ _id: _id, title: title, completed: completed }),
    })
    if (response.status !== 200 && response.status !== 201) {
      throw 'Error'
    }
    const body = await response.json()
    return body
  },
  [REMOVE_TODO]: async (_id: string): Promise<void> => {
    console.log('_id remove todo', _id)
    const response = await fetch('/api/deleteTodo', {
      method: 'POST',
      body: _id,
    })
    if (response.status !== 200 && response.status !== 201) {
      throw 'Error'
    }
    const body = await response.json()
    return body
  },
}

export const getTodos = (): Promise<Response> => {
  return fetch('/api/getTodos')
}
