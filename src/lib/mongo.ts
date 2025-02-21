import { mongoose } from "@typegoose/typegoose";
import { env } from "./env";

/**
 * Connects to the Mongo instance.
 */
export async function connectMongo() {
  await mongoose.connect(env.MONGO_CONNECTION_STRING);
}
