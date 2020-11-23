import { connectToDatabase } from 'src/utils/mongodb'
import { ObjectId } from 'mongodb'
//we return the _id we generate provisionally for the new todo and the info of the new todo

export default async (req, res): Promise<any> => {
  let result
  try {
    const { db } = await connectToDatabase()
    const dbTodos = await db.collection('todos')
    const { _id, title, completed } = JSON.parse(req.body)
    const response = await dbTodos.insert({
      _id: ObjectId(_id),
      title: title,
      completed: completed,
    })
    result = { result: response.ops }
    res.statusCode = 200
  } catch (err) {
    result = { error: err, message: 'An error has ocurred' }
    res.statusCode = 400
  }

  res.json(result)
}
