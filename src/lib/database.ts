import mongoose, { Model, Document, Types } from 'mongoose'

export const connectDB = async (): Promise<any> => {
  return new Promise((res, rej) => {
    if (mongoose.connections[0].readyState) {
      res(mongoose.connections[0])
    }
    // Using new database connection

    mongoose.connect(
      process.env.DATABASE_URL || '',
      {
        useNewUrlParser: true,
        bufferCommands: false,
        bufferMaxEntries: 0,
        useUnifiedTopology: true,
      },
      function (err) {
        if (err) {
          console.error(err)
          rej(err)
        } else {
          res(mongoose.connection)
        }
      }
    )
  })
}

export interface ICityDoc extends Document {
  name: string
  coordinates: {
    lon: number
    lat: number
  }
}

export interface IUserDoc extends Document {
  email: string
  password: string
  cities: Types.DocumentArray<ICityDoc>
}

// We have to check if it already exists because next.js does something akin to hot module
// reloading for the api endpoints so this line may get called more than once in dev
// which would result in a OverwriteModelError
export const User =
  (mongoose.models.User as Model<IUserDoc>) ||
  mongoose.model<IUserDoc>(
    'User',
    new mongoose.Schema({
      email: {
        type: String,
        required: true,
        unique: true,
      },
      password: {
        type: String,
        required: true,
      },
      cities: {
        type: [
          new mongoose.Schema({
            name: { type: String, required: true },
            coordinates: {
              type: new mongoose.Schema({
                lon: {
                  type: Number,
                  required: true,
                },
                lat: {
                  type: Number,
                  required: true,
                },
              }),
              required: true,
            },
          }),
        ],
        required: true,
        default: [],
      },
    })
  )
