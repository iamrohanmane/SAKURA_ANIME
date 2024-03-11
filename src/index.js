import dotenv from "dotenv"
// require('dotenv').config({path:"./env"})
import connectDB from "./db/db_connect.js";
import {app} from "./app.js";

dotenv.config({
    path: './env'
})

connectDB()

.then(()=>{
  app.listen(process.env.PORT || 8000, () => {
  console.log(`server is running on port ${process.env.PORT }`);
})
})
.catch((err)=>{
  console.log("MONGODB CONNETION FAILED")
})
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

