import mongoose from "mongoose";
export async function connectDB() {
    try {
        await mongoose.connect(`${process.env.MONGO_URL}`)
        console.log("connection of mongoDB established")

    } catch (e) {
        console.log("Error while connecting to Dababase",e)
     }
}