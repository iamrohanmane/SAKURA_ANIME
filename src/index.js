import dotenv from "dotenv"
// require('dotenv').config({path:"./env"})
import connectDB from "./db/db_connect.js";

dotenv.config({
    path: './env'
})

connectDB()
/*
import { Express } from "express";
const app = express()
(async () => {
  try {
    await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
    app.on("ERROR", (error ) =>{
        console.log("error:", error);
        throw error
    })
    app.listen(process.env.PORT, () =>{
        console.log(`app on listening ${process.env.PORT}`)
    })
  } 
  catch (error) {
    console.error("ERROR =", error);
    throw err;
  }
})();
*/

