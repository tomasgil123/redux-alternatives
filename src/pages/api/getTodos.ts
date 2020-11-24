// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { connectToDatabase } from 'src/utils/mongodb'

export default async (req, res): Promise<any> => {
  let result
  try {
    const { db } = await connectToDatabase()
    const dbTodos = await db.collection('todos')
    const response = await dbTodos.find({}).toArray()
    result = response
    res.statusCode = 200
  } catch (err) {
    result = { error: err, message: 'An error has ocurred' }
    res.statusCode = 400
  }

  res.json(result)
}
