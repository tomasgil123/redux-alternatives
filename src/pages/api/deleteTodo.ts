import { connectToDatabase } from 'src/utils/mongodb'
import { ObjectId } from 'mongodb'

export default async (req, res): Promise<any> => {
  let result
  try {
    const { db } = await connectToDatabase()
    const dbTodos = await db.collection('todos')
    const response = await dbTodos.deleteOne({ _id: ObjectId(req.body) })
    if (response.deletedCount === 0) {
      throw 'No document was deleted'
    }
    result = { success: true }
    res.statusCode = 200
  } catch (err) {
    result = { error: err, message: 'An error has ocurred' }
    res.statusCode = 400
  }

  res.json(result)
}
