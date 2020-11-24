import { connectToDatabase } from 'src/utils/mongodb'
import { ObjectId } from 'mongodb'

export default async (req, res): Promise<any> => {
  let result
  try {
    const { db } = await connectToDatabase()
    const dbTodos = await db.collection('todos')
    const { _id, completed } = JSON.parse(req.body)
    const response = await dbTodos.updateOne(
      { _id: ObjectId(_id) },
      {
        $set: { completed: completed },
      }
    )
    if (response.deletedCount === 0) {
      throw 'No document was updated'
    }
    result = { success: true }
    res.statusCode = 200
  } catch (err) {
    result = { error: err, message: 'An error has ocurred' }
    res.statusCode = 400
  }

  res.json({ result })
}
