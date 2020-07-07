import mongoose, { Model, Document } from 'mongoose'

export const connectDB = async (): Promise<mongoose.Connection> => {
  if (mongoose.connections[0].readyState) {
    return mongoose.connections[0]
  }
  console.log(process.env.DATABASE_URL)
  // Using new database connection
  return await mongoose.createConnection(process.env.DATABASE_URL || '', {
    useNewUrlParser: true,
    bufferCommands: false,
    bufferMaxEntries: 0,
    useUnifiedTopology: true,
  })
}

interface IUser extends Document {
  email: string
  password: string
}

// We have to check if it already exists because next.js does something akin to hot module
// reloading for the api endpoints so this line may get called more than once in dev
// which would result in a OverwriteModelError
export const UserModel =
  (mongoose.models.User as Model<IUser>) ||
  mongoose.model<IUser>(
    'User',
    new mongoose.Schema({
      email: {
        type: String,
        required: true,
      },
      password: {
        type: String,
        required: true,
      },
    })
  )
